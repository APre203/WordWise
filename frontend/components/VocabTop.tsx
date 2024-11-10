"use client";
import React from 'react'
import {Box, Button, DialogContent, DialogTitle, Typography, Dialog} from '@mui/material'
import { useState } from 'react';

type props = {
  name: string,
  definition: string
}

const VocabTop = ( props: props ) => {
  const [open, setOpen] = useState(false);
  const [define, setDefine] = useState(props.definition);



  const fetchPlace = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

  const handleClickOpen = async () => {
    if(define === ''){
      try{
        const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${props.name}`)
        const data = await r.json();
        console.log(data[0].meanings[0].definitions[0].definition)
        setDefine(data[0].meanings[0].definitions[0].definition)
        setOpen(true)
      }catch (e) {
        console.log("ERROR WORD NOT FOUND")
        setOpen(false)
        return
      }
    }
    setOpen(true)
  }

  const handleClickClose = () => {
    setOpen(false)
  }

  return (
    <Box >
      <Button variant='outlined' onClick={handleClickOpen}>{props.name}</Button>
      <Dialog open={open} onClose={handleClickClose}>
        <DialogTitle align='center'> {props.name} </DialogTitle>
        <DialogContent dividers>
          <Typography align='center'>
            Definition of {props.name}: {define}
          </Typography>
        </DialogContent>
        {/* <DialogActions>
          <IconButton autoFocus onClick={handleClickClose}>
            x
          </IconButton>
        </DialogActions> */}
      </Dialog>
    </Box>
  )
}

export default VocabTop