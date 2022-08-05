export interface IterableJson {
  [props: string]: any;
}

// static implementation of JsonConvertible
// principle: any objects extends this class will only need to be used one
// any new data will be on a separate object instead
export class JsonConvertible {
  toJson(): IterableJson { return {} }
  static fromJson(json: IterableJson): JsonConvertible { return new JsonConvertible() }
}