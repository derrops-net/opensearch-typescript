export interface Ecommerce {
    category:              string[];
    currency:              string;
    customer_first_name:   string;
    customer_full_name:    string;
    customer_gender:       string;
    customer_id:           number;
    customer_last_name:    string;
    customer_phone:        string;
    day_of_week:           string;
    day_of_week_i:         number;
    email:                 string;
    manufacturer:          string[];
    order_date:            Date;
    order_id:              number;
    products:              Product[];
    sku:                   string[];
    taxful_total_price:    number;
    taxless_total_price:   number;
    total_quantity:        number;
    total_unique_products: number;
    type:                  string;
    user:                  string;
    geoip:                 Geoip;
    event:                 Event;
}

export interface Event {
    dataset: string;
}

export interface Geoip {
    country_iso_code: string;
    location:         Location;
    region_name:      string;
    continent_name:   string;
    city_name:        string;
}

export interface Location extends GeoPoint {
    lon: number;
    lat: number;
}

export interface Product {
    base_price:           number;
    discount_percentage:  number;
    quantity:             number;
    manufacturer:         string;
    tax_amount:           number;
    product_id:           number;
    category:             string;
    sku:                  string;
    taxless_price:        number;
    unit_discount_amount: number;
    min_price:            number;
    _id:                  string;
    discount_amount:      number;
    created_on:           Date;
    product_name:         string;
    price:                number;
    taxful_price:         number;
    base_unit_price:      number;
}
