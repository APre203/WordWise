import React from 'react'

type props = {
  error: string     
}

const ErrorPage = (props:props) => {
  return (
    <div>You encountered an Error! - {props.error}</div>
  )
}

export default ErrorPage