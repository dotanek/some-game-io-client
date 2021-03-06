export interface ServerDataModel {
  entities: {
    [name: string]: EntityDataModel;
  };
}

export interface EntityDataModel {
  name: string;
  position: Vector2DataModel;
  velocity: Vector2DataModel;
  mass: number;
}

export interface Vector2DataModel {
  x: number;
  y: number;
}
