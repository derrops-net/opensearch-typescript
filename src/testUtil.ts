import { defaultProvider } from "@aws-sdk/credential-provider-node"
import * as os from "@opensearch-project/opensearch"
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws"

export const makeClientWithEndpoint = async (endpoint? : string) => {
    return new os.Client({
        ...AwsSigv4Signer({
        region : process.env.AWS_REGION || "ap-southeast-2",
        service : 'es',
        getCredentials: () => {
            const credentialsProvider = defaultProvider()
            return credentialsProvider()
        },
        }),
        node: `https://${endpoint || process.env.ES_ENDPOINT || "search-alertops-qeosrpbxjt4uyywic5fycm4pg4.ap-southeast-2.es.amazonaws.com"}`
    })
}