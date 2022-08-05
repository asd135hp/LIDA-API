export default interface Serializable {
  serialize(): string;
  deserialize(serializedObject: string): void;
}