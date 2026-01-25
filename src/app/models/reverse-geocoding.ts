export interface MapboxResponse {
    features: Feature[];
}

export interface Feature {
    id: string;
    text: string;
    place_name: string;
    /**
     * Center is returned as [longitude, latitude]
     */
    center: [number, number];
    context: Context[];
}

export interface Context {
    id: string;
    text: string;
}
