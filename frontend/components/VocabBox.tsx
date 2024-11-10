'use client';
import { Dispatch, useState } from "react";
import { Button } from '@mui/material'
type props = {
    val: string
    location: number
    addWord: (word: string, index:number) => void
    isClicked: boolean
        
}

const VocabBox = (props: props) => {

    // const [isClicked, setIsClicked] = useState(false)

    const clicked = () => {
        if(!props.isClicked){
            props.addWord(props.val, props.location)
        }
    }

    return (
        <Button 
            disabled={props.isClicked} 
            sx={{
                color: props.isClicked ? 'red' : 'black',
                p:5}} 
            fullWidth 
            onClick={clicked}>
        
            {props.val}
        </Button>
    )
}

export default VocabBox