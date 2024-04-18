export interface ServerLog {
    agent:     string;
    bytes:     number;
    clientip:  string;
    extension: string;
    geo:       Geo;
    host:      string;
    index:     string;
    ip:        string;
    machine:   Machine;
    memory:    number;
    message:   string;
    phpmemory: null;
    referer:   string;
    request:   string;
    response:  number;
    tags:      string[];
    timestamp: Date;
    "@timestamp": Date;
    url:       string;
    utc_time:  Date;
    event:     Event;
}

export interface Event {
    dataset: string;
}

export interface Geo {
    srcdest:     string;
    src:         string;
    dest:        string;
    coordinates: Coordinates;
}

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface Machine {
    ram: number;
    os:  string;
}