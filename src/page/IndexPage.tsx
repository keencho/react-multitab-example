import React, {useState} from "react"

const IndexPage = (): JSX.Element => {
  const [value, setValue] = useState<number>(0);
  return (
    <>
      value : {value} <br />
      <button onClick={() => setValue(value + 1)}>클릭하시오.</button>
    </>
  )
}

export default IndexPage
