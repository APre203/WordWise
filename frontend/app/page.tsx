"use client";
import { useEffect, useState } from "react";
import { Stack, Box, Button, TextField, Alert } from "@mui/material";
// import { handler } from "./api/vocabulary/route"; 
import {useRouter} from "next/navigation";
export default function Home() {
  const router = useRouter()
  const [words, setAllWords] = useState(['','','',''])
  const [error, setError] = useState('Make sure to include at least one word!')
  const [hasError, setHasError] = useState(false)
  const clicked = async () => {
    const checkIfGood = async () => {

      if(words[0]==='' && words[1] === '' && words[2] === '' && words[3] === ''){
        setError('Make sure to include at least one word!')
        setHasError(true)
        return true
      }
      for(let index in words){
        const word = words[index]
        if(word != ''){
          const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
          if(r.status === 404){
            const newError = `The word "${word}" cannot be found in the dictionary!`
            setError(newError)
            setHasError(true)
            return true
          }
        }
      }
      setHasError(false)
      return false
    }
    const status = await checkIfGood()
    if(status){
      return
    }

    router.push(`/game?word1=${words[0]}&word2=${words[1]}&word3=${words[2]}&word4=${words[3]}`)
  }

  const setWords = (e: any, num: number) => {
    const list =  [...words]
    list[num] = e.currentTarget.value
    setAllWords(list)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {hasError ?
        <Alert onClose={() => {setHasError(false)}} severity="error"> {error} </Alert> : <></>
      }
      Type in the words!
      <Stack direction={'row'} component='form' spacing={2}>
        <TextField onChange={(e) => setWords(e, 0)} label="Word 1" variant="standard" value={words[0]}/>
        <TextField onChange={(e) => setWords(e, 1)} label="Word 2" variant="standard" value={words[1]}/>
        <TextField onChange={(e) => setWords(e, 2)} label="Word 3" variant="standard" value={words[2]}/>
        <TextField onChange={(e) => setWords(e, 3)} label="Word 4" variant="standard" value={words[3]}/>
      </Stack>
      <Button onClick={clicked}> Get Started! </Button>
    </div>
  );
}
