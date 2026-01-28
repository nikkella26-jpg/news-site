export interface SwedishLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  municipality: string;
  region: string;
}

export const DEFAULT_LOCATION: SwedishLocation = {
  id: "linkoping",
  name: "Linköping",
  latitude: 58.4108,
  longitude: 15.6214,
  municipality: "Linköpings kommun",
  region: "Östergötlands län",
};
