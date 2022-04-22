import React, {useEffect, useState} from "react"

interface Props {
  name: string,
  age: number
}

const IndexPage = (props: Props): JSX.Element => {
  const [value, setValue] = useState<number>(0);
  
  useEffect(() => {
    console.log('open');
    
    return () => {
      console.log('close');
    }
  },[]);
  
  return (
    <>
      value : {value} <br />
      name: {props.name} / age: {props.age} <br />
      <button onClick={() => setValue(value + 1)}>클릭하시오.</button>
    </>
  )
}

export default IndexPage
