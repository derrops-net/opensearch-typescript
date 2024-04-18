# Coding Typescript Search

For this tutorial I'll be using the sample data provided by opensearch
 - opensearch_dashboards_sample_data_logs


Opensearch/Elasticsearch are powerful tools for searching, as well as for metric and document aggregation (We will be using opensearch but this same approach could be used for Elasticsearch). But this power is difficult to wield, as anything beyond the most basic of queries and aggregations deals with complex JSON structure. For constructing queries, the `Dev Tools` Tab within Opensearch Dashboards. But these same luxuaries are not available where you might expect them to be most likely, Typescript! The typed javascript, ideal for working with JSON. However there is no strongly typed way which enable your IDE to guide you to the Search promise land.


On the response side this is even worse, there is no easy way to interpret responses from opensearch, with the JSON returned being imensely complex, nested mix of arrays, different types, buckets of buckets of buckets, and so on. Yet we do know based on the query the structure that the JSON will take on, but using any of the client SDKs, `@opensearch-project/opensearch`, there is practically no help in the type-system to provide guide rails for your as you code.


This puts Developers off using opensearch as it does not provide a ease-of-use when interacting with opensearch, and it is difficult to improve incrementally as getting bogged down in nested JSON, making it difficult to index the responses from opensearch.


## 1st Approach Quick Types
When I was first faced with this issue, suprised by the lack of types within the Javascript/Typescript SDK, I thought to myself, that's ok, I'll just use Quick Types https://quicktype.io/. All I have to do is run the quicktype cli on the JSON and generate some typescript files, and import them into my project. This would work as follows:

 1. I would copy the `_source` part of a given document to a .json file, i.e. `ServerLog.json`
 2. Then I would run `quicktype ServerLog.json -o ServerLog.ts`, and paste this into my project

This may require some re-work in `2.` If you don't get exactly the desired result. And I would also do this for my querries and responses, again they would often need editting for the desired types etc if quicktype got anything wrong, but it would do a decent job.

## Draw Backs of Quick Types Approach
This approach, whilst made things more manaable just did not scale at all. Doing this for every query and reponse was cumbersome, and was a very brittel work flow. I would need to re-generate types from repsonses often if anything changed. It was also error-prone, in that sometimes I would make mistakes as to if a field was a key from the name of an agg, or the field in a document.

There had to be a better way of achieving this, could there not be a type-system which would figure all this out for you, and you could simply describe your search (query + agg), and the correct return type would be returned for you. Isn't this the sort of problem generics were designed for? At least I thought so.

# DerropsSearch
After scowering the internet I could not find anything which met my desires, so I was forced to fend for myself and attempt to write my own library which could do this. No longer would I have this un-manageable JSON structure where I had to fend for myself when trying to figure out what was the key for that average bucket aggregation in that date histogram query, calculated for each customer. Such nested structures are just impossible for me to keep in my head and navigate. The only way to validate your code is to run tests, unless responses are readily available, this will mean querying opensearch. Modern day ORMs (Object Relational Mappers) whilst having no way near the functionality of opensearch end up outperforming opensearch in productivity, for these reasons. I often find myself advocating for making more use of opensearch, but Developers don't tend to take on any initiatives themselves in this area, they may like what I've done, but they also like that I've done it, and they don't have to.


## How it works.
Generics. That's what I'd write if I only had 1 word to describe it. In general I'm not adding any more functionality than what's present in any SDK. I'm only aiming to describe things more concisely, so that the IDE will help guide in the use of opensearch. To achive this I needed a way to generate both the type of the query input, and response, for opensearch.


## Step 1 - Fields
The first thing I feel developers notice when working with opensearch `Dev Tools` is the auto-completion, espically when it comes to fields. When configuring a `terms` agg, the `keyword` and `number` fields will be suggested to you as you type. I wondered if there was a way to do the same thing in typescript. And there was:

```typescript
type Join<T extends string, U extends string> =
  "" extends T ? U : "" extends U ? T : `${T}.${U}`;

type DeepKeysMatching<T, V> = T extends V ? "" :
  T extends Array<any> ? "" : // IGNORE ARRAYS
  T extends object ? {
    [K in keyof T]: Join<string & K, DeepKeysMatching<T[K], V>>
  }[keyof T] : never;
```

Credit: https://stackoverflow.com/questions/75063998/get-union-of-all-dotted-object-paths-to-properties-of-a-particular-type

This post here provided me with the knowledge needed to figure out how to find all the fields of a given type, for a given type `<T>`. Resulting in the following definitions:

```typescript
export type StringAtt<T> = DeepKeysMatching<T, string>;
export type NumberAtt<T> = DeepKeysMatching<T, number>;
export type DateAtt<T> = DeepKeysMatching<T, Date>;
```


Then, I also found code to handle the `.keyword` convention often used:

```typescript
type addSuffix<TKey, TSuffix extends string> = TKey extends string
  ? `${TKey}${TSuffix}`
  : never;

export type KeyWord<T> = addSuffix<StringAtt<T>, '.keyword'>
```

I throughly enjoy in typescript jsut how easy it is to re-use and compose types of one-another, comingind the `addSuffix` type with the `StringAtt` worked like a charm.

## Search Statement
```typescript
type Search<T, A extends AggQueryDescription>
```
THe search statemet is the core of how all the JSON structure is determined. Based off the Type of the Documents in the index `T`, and the query structure `A`, we have enough information to determine the query input, the type of the hits `T`. Using some recursive type magic (types referencing themselves) as well as the types of the attributes before to make use in expressions such as `[key in TextOrKeywordAtt<T>]` it was not so difficult to cover most of the JSON API fairly quickly.

## Query Strucutre
```typescript
export type AggType = 
    "terms" | 
    "avg" |
    "sum" |
    "min" |
    "max" |
    ...

export type AggQueryDescription = {[key : string] : {
    agg : AggType,
    aggs? : AggQueryDescription
}}
```
This was a great example of the recursion type system doing it's thing in typescript, which basically was all I needed to do, to accurately describe the input JSON, (and latter output) for a given query to write, which was exceedingly simple compared to this stucture I was working with most of the time. This meant in theory, all that was needed to be done to have a complete type-system in opensearch was to reference the Document Type `<T>`, and define the `AggQueryDescription` type parameter, for example:

```typescript
Search<ServerLog, {
    exampleDateHist : {
        agg : "date_histogram",
        aggs : {
            "agentTerms" : {
                agg : "terms",
            }
        }
    }
}> = ....
```
Whilst the above code is not by all means trivially simplistic in structure, it is manageable, to deal with one layer at a time. But how could you take this code and generate the input type?

## Mapping literals to types
I could infact map the literial string `AggType` to a parameterized type, as follows:
```typescript
type AggTypeDictionary<T, AT extends AggType> = 
    AT extends "terms" ? TermsAgg<T> :
    AT extends "avg" ? AvgAgg<T> :
    AT extends "sum" ? SumAgg<T> :
    ... // All the other Agg Types
    AT extends "filter" ? Filter<T> :
never;

type AggTypeDictionaryRecursive<T, AT extends AggType, AGS extends AggQueryDescription> =  
    AGS extends object ?  {
        aggs : {
            [K in keyof AGS] : AggTypeDictionaryRecursive<T,AGS[K]["agg"],AGS[K]["aggs"]>
        }
    } & AggTypeDictionary<T, AT> :
    AT extends "terms" ? TermsAgg<T> :
    AT extends "avg" ? AvgAgg<T> :
    ... // All the other Agg Types
        AT extends "filter" ? Filter<T> :
never;
```

I found I needed to define these two types twice, as to account for the cases:
 - aggs containing no further aggs
 - aggs containing further nested aggs

Each agg type had to have a corresponding typescript type such as:
```typescript
export type DateHistAgg<T> = {
    date_histogram : {
        interval : string | "day"| "hour"| "minute" | "quarter" | "second" | "week" | "year"
    } & DateField<T>
}
```
I tried my best to type these which would provide the best gauard rails when coding, by giving the compiler and therefore the IDE the most information possible for giving developers good auto-correct ability.

## Agg Structure
Now it was finally possible to describe the this nested agg structure through recursion as follows:
```typescript
export type Search<T, A extends AggQueryDescription> = {
    aggs? : {[K in keyof A] : AggTypeDictionaryRecursive<T,A[K]["agg"],A[K]["aggs"]>},
    ///...

}
```

And I'd be lying if I said I fully understood this code, I merely looked for patterns out there for existing ways to do similar things, and then with trial and error eventually found the compiler giving me the proper hints in my IDE, and hey, seemed to work, I was estatic, it felt like I was 50% there to solving this problem once and for all.

## Return Structure
The return structure was giving me roadblocks. Initially I had focused my approach on creating a typescript client wrapper to the opensearch client wrapper, and using generics to define the return type, something like:

```typescript
{[a in keyof A]} : {Response TODO}
```

But this would result in a massive loss of type information, meaning my end goal of creating guard rails for the JSON output from opensearch was not being met. As shown in this code below compiling

```typescript
TODO
```


This eloborate idea was jsut that, eloborate. So I thought to myself, maybe it shouldn't be eloborate, maybe it should be basic. If I already have these parameterized types which are working for the query input, why don't I use the same type for the output.

I didn't likethis idea at first, because it went against functinoal programming paradigms, however I knew it was in my back-pocket.

 So after a day or two of getting no where, and slowly closing in on the unescable fact that this was a limitation of typescript generics, I would reluctantly settle on this option, and have the following defintion of the return type:

```typescript
export type SearchResponse<T, A extends AggQueryDescription > = {
    "took" : number,
    "timed_out" : boolean,
    "_shards" : ShardsHitResult,
    "hits" : Hits<T>,
    "aggregations"? : {[K in keyof A] :  AggTypeResponseDictionary2<T,A[K]["agg"],A[K]["aggs"]>},
}
```
Which used the same mechanisms as the query to recusrively describe the JSON structure. 

There were some additional complications in the structure that the resulsts of nested aggs were in the buckets of their parent aggs, which complicated things slightly as this meant types had to be passed down into buckets. But I eventually landed on the solution.



# Example


The following query is very large, but shows how this library can be used to constrcut these large queries with relative ease. Once the form of the aggregation query is known, then it is straightforward to define the type. Referencing the return elements and mapping over the result is trivaially easy:


```typescript
const searchExample : q.Search<ServerLog, {
    exampleDateHist : {
        agg : "date_histogram",
        aggs : {
            "agentTerms" : {
                agg : "terms",

            }
        }
    },
    adjacency : {
        agg : "adjacency_matrix"
    },
    test : {
        agg : "terms",
        aggs : {
            "innerTest" : {
                agg : "extended_stats"
            },
            "somethingMore" : {
                agg : "terms",
                aggs : {
                    "topHits" : {
                        agg : "top_hits"
                    }
                }
            }
        }
    }
}> = {
    _source : {
        includes : [
            "bytes",
            "utc_time"
        ]
    },
    query : {
        bool : {
            must : [
                {
                    "terms":
                    {
                        "agent.keyword": [
                            "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
                            "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
                    ]}
                }
            ],
            "minimum_should_match": 2,
            "should": [
              {
                "term": {
                  "tags.keyword": "login"
                }
              },
              {
                "term": {
                  "tags.keyword": "success"
                }
              }
            ]
        }
    },
    aggs : {
        "exampleDateHist" : {
            "date_histogram" : {
                "interval": "3d",
                "field" : "timestamp"
            },
            "aggs" : {
                "agentTerms" : {
                    "terms" : {
                        "field" : "agent.keyword",
                    }
                }
            }
        },
        "adjacency" : {
            "adjacency_matrix" : {
                "filters" : {
                    "linux" : {
                        "match" : {
                            "agent.keyword" : "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
                        }
                    },
                    "windows" : {
                        "match" : {
                            "agent.keyword" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
                        }
                    }
                }
            }
            
        },
        "test" : {
            "terms" : {
                "field" : "agent.keyword"
            },
            "aggs" : {
                "innerTest" : {
                    "extended_stats" : {
                        "field" : "bytes"
                    }
                },
                "somethingMore" : {
                    "terms" : {
                        "field" : "referer.keyword"
                    },
                    "aggs" : {
                        "topHits" : {
                            "top_hits" : {
                                "size" : 3
                            }
                        }
                    }
                }
            }
        }
    },
    "size" : 10
}
await tsClient.msearchDictTS(msearch, INDEX_LOGS)

searchExample.response.aggregations.exampleDateHist
            .buckets.flatMap(b => b.agentTerms
            .buckets.flatMap(a => ({doc_count : a.doc_count, key : `${b.key}.${a.key}`})))
```

## MultiSearch
With this type-safety brings benifits to multi-search as well. Before knowing these types, adding yet more complexity to the types was un-workable. Creating a multi-search query would be a large undertaking, now it is accessible typescript gives all detail of the search available to you.




# Further Work
The follow types are not yet supported but are on my rader
 - Arrays
 - Geopoints

Aditionally all aggregations and query options need to be supported in the API.

# Refactoring

I need to become more discipliend in naming things, and conforming to existing terminology when it exists.
 - Confirm to terminology Bucket Aggregations
 - Confirm to terminology Metric Aggregations






# opensearch-query-dsl
# opensearch-query-dsl
# opensearch-query-dsl
