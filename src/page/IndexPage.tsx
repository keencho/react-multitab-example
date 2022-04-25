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
      ※ 중복을 허용하는 탭입니다.※<br /><br />
      props test ----- name: {props.name} / age: {props.age} <br />
      react lifecycle test ----- value : {value} <br />
      <button onClick={() => setValue(value + 1)}>클릭</button>
    </>
  )
}

export default IndexPage
