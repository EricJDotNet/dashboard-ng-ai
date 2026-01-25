export interface MapboxV6Response {
    type: string;
    features: MapboxFeature[];
    attribution: string;
}

export interface MapboxFeature {
    type: string;
    id: string;
    geometry: Geometry;
    properties: FeatureProperties;
}

export interface Geometry {
    type: string;
    coordinates: [number, number]; // [Longitude, Latitude]
}

export interface FeatureProperties {
    mapbox_id: string;
    feature_type: string;
    full_address: string;
    name: string;
    place_formatted: string;
    context: AddressContext;
    coordinates: CoordinateProperties;
}

export interface AddressContext {
    street?: ContextItem;
    postcode?: ContextItem;
    place?: ContextItem;
    region?: ContextItem;
    country?: ContextItem;
}

export interface ContextItem {
    name: string;
    mapbox_id: string;
}

export interface CoordinateProperties {
    longitude: number;
    latitude: number;
}
