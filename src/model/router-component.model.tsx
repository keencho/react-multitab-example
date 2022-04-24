export default interface RouterComponentModel {
  name: string,
  uniqueKey: string,
  sequence: number,
  active: boolean,
  component: JSX.Element
}
