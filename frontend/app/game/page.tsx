"use client";

import VocabBox from "@/components/VocabBox";
import Skelet from "@/components/Skelet";
import { useEffect, useState } from "react";
import { Stack, Box, Button, Skeleton, Paper, Divider } from "@mui/material";
import Grid from '@mui/material/Grid2'
import { useSearchParams } from "next/navigation";
import ErrorPage from "@/components/ErrorPage";
import {useRouter} from "next/navigation";
import VocabTop from "@/components/VocabTop";
// import { handler } from "./api/vocabulary/route"; 

export default function Home() {
  const COUNT = 4 // used in addSelectedWord
  const searchParams = useSearchParams()
  const word1 = searchParams.get('word1')
  const word2 = searchParams.get('word2')
  const word3 = searchParams.get('word3')
  const word4 = searchParams.get('word4')
  const searchList: string[]= []
  
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')
  const [isWon, setIsWon] = useState(false)

  const [isCorrect, setIsCorrect] = useState(0)


  const router = useRouter()

  const keyMap: {[key:string]: boolean} = {}
  const [dataMap, setDataMap] = useState<{[key:string]:string[]}>({})
  for(let word of [word1, word2, word3, word4]){
    if (word !== null && word !== ''){
        keyMap[word] = false
        searchList.push(word)
    }
  }
  
  const [kMap, setKMap] = useState<{[key:string]:boolean}>(keyMap)
  const [wList, setWList] = useState<string[]>([]) // testlist
  const [wMap, setWMap]=  useState<{[key:string]:boolean}>({}) // testmap
  
  function shuffleArray(array:string[]) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

  useEffect( () => {
    if(!loading || wList.length > 0){
        return
    }
    if(searchList.length === 0){
        setIsEmpty(true)
        return
      }
    const clicked = async () => { 
      const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
      console.log(OPENROUTER_API_KEY)
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemma-2-9b-it:free",
                "messages": [
                {
                    "role": "system",
                    "content": 
                    `You are a dictionary word generator that generates ${COUNT} DIFFERENT synonyms for EACH VALID word in the list and you must follow these rules: 
                     - You MUST return a correctly formated map with this syntax: { 'words':{...} , 'error':... }
                     - The 'error' key MUST link to a bool either 'true' or 'false' and it will be true when there is ANY WORD that is not an actual word that can be found in a common dictionary
                     - IF the error is false, the 'words' key MUST link to another correctly formated map that will link each given word as a key to
                      4 DIFFERENT SYNONYMS as its value in a PROPERLY FORMATED LIST. 
                     - IF the error is true, the 'words' key MUST link to a list of all the given words that would not be found in a dictionary. 
                     - You are not allowed to say anything else except return this properly formatted map in JSON FORMAT I REPEAT JSON FORMAT
                     - Make sure EACH ARRAY STARTS AND ENDS WITH [] AND EACH MAP STARTS AND ENDS WITH {}
                    `
                },
                {
                    "role":"user",
                    "content":JSON.stringify(searchList)
                }
                ]
            })
            });
        const data = await r.json();
        let json:string = data.choices[0].message.content
        const retval: {[key:string]:any} = await JSON.parse(json)
        const message = retval.words
        const error = retval.error
        return [message, error]
            
      }
    
    const addWords = async (wordMap: {[key:string]:string[]}) => {
        const lst: string[] = []
        const wmap: {[key:string]:boolean} = {} 
        for(let value of Object.values(wordMap)){
            for(let v of value){
                if(!Object.keys(wmap).includes(v)){
                    wmap[v] = false
                    lst.push(v)
                }
            }
        }
        console.log(wordMap)
        console.log(lst)
        shuffleArray(lst)
        setWList(lst)
        setWMap(wmap)

    }

    const setValue = async () => {
        try{
            const data = await clicked()
            console.log(data)
            if (data[1] == true){
              setIsError(true)
              setError('A word you typed could not be found!')
              return
            }
            await addWords(data[0])
            setDataMap(data[0])
        }catch (e) {
            console.log(e)
            setError('A word you typed could not be found!')
            setIsError(true)
            return
        }
    
    }

    

    setValue().then(() => {setLoading(false)})
    return
        
    }, [])
  

  const CORRECT = 'green'
  const WRONG = 'red'
  const STATIC = 'black'
  const [wordList, setWordList] = useState<string[]>([]); // List of words that are clicked
  

  const checkCorrectWords = (words: string[], dataMap:{[key: string]: string[]}) : boolean => {
    for(let [key, val] of Object.entries(dataMap)){
      let isIn = true
      for(let word of words){
        if (!val.includes(word)){
          isIn = false
        }
      }
      if(isIn){
        const newkMap = kMap
        newkMap[key] = true
        setKMap(newkMap)
        return true
      }
    }
    return false
  }

  const removeWords = (words: string[]) : string[] => {
    for(let word of words){
      const index = wList.indexOf(word)
      if (index > -1){
        wList.splice(index, 1)
      }
    }
    return words
  }

  const addWords = (words: string[]) : string[] => {
    setWList(list => [...words, ...list])
    return words
  }

  const revertWords = (words: string[]): void => {
    const oldMap = wMap
    for(let word of words){
      oldMap[word] = false
    }
    return
  }


  const addSelectedWord = (word: string, index: number) => {
    let wordLength = wordList.length + 1 
    wMap[word] = true
    setWMap(wMap)
    setWordList( list => [...list, word])
    
    if (wordLength == COUNT){
      const correct: boolean = checkCorrectWords(wordList, dataMap)
      const wholeList = [...wordList, word]
      if (correct){
        removeWords(wholeList)
        addWords(wholeList)
        setWordList([])
        setIsCorrect(prev => prev + 1)
        console.log(isCorrect)
      }else{
        revertWords(wholeList)
        setWordList([])

      }
    }
  }


  if(isEmpty || isError){
    return (
        isEmpty ? 
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            Empty
        </div> 
        :
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <ErrorPage error={error}/>
        </div>
    )
  }else if (isCorrect === searchList.length){
    return(
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            Congrats you won!
            <Button onClick={() => router.push(`/`)}> Play Again</Button>
        </div>
    )
  }else{
      return (
        (loading && Object.keys(dataMap).length == 0 ) 
        ?
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <Skelet />
        </div>
        :
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
          {/* {Object.values(dataMap).toString()} */}
          <Box >
            {/* {words ? Object.entries(words).map( ([key, value], index) => <div key={index}>{key}</div>) : 'Loading'} */}
            <Stack sx={{justifyContent:'space-around', py:3}} direction={'row'} >
              {Object.entries(dataMap).map(([key, _], index) => <VocabTop key={index} name={key.toUpperCase()} definition={""}/>)}
            </Stack>
            <Divider/>

            <Grid 
              container
              alignContent={'center'}
              alignItems={'center'}
              wrap="wrap"
              textAlign={'center'}
            >
              {wList.map((value, index) => 
              <Grid 
                size={3} 
                key={index} >
                <VocabBox addWord={addSelectedWord} isClicked={wMap[value]} val={value} location={index}/>
              </Grid> )}
            </Grid>
            
            
          </Box>
        </div>
      );
  }
}
