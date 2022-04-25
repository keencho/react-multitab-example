export default interface RouterComponentModel {
  displayName: string,
  uniqueKey: string,
  sequence: number,
  active: boolean,
  component: JSX.Element
}
