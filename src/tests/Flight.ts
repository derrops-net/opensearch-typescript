export interface Flight {
    FlightNum:          string;
    DestCountry:        string;
    OriginWeather:      string;
    OriginCityName:     string;
    AvgTicketPrice:     number;
    DistanceMiles:      number;
    FlightDelay:        boolean;
    DestWeather:        string;
    Dest:               string;
    FlightDelayType:    string;
    OriginCountry:      string;
    dayOfWeek:          number;
    DistanceKilometers: number;
    timestamp:          Date;
    DestLocation:       Location;
    DestAirportID:      string;
    Carrier:            string;
    Cancelled:          boolean;
    FlightTimeMin:      number;
    Origin:             string;
    OriginLocation:     Location;
    DestRegion:         string;
    OriginAirportID:    string;
    OriginRegion:       string;
    DestCityName:       string;
    FlightTimeHour:     number;
    FlightDelayMin:     number;
}

export interface Location {
    lat: string;
    lon: string;
}
