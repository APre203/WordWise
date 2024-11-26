from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4
from api import APIHandler

app = FastAPI()

class Messages(BaseModel):
    words: List[str] = []

newWords = []

@app.get('/')
def show_words():
    return str(newWords)

def makeToString(listWords: Messages):
    if len(listWords.words) == 0:
        raise HTTPException(status_code=404, detail="Didn't submit any words...")
    newString = "["
    for m in listWords.words:
        newWords.append(m)
        newString = newString + m + ","
    newString = newString[:-1]
    newString += "]"
    return newString

@app.post('/messages/')
def find_words(wordList: Messages):
    newString = makeToString(wordList)
    api = APIHandler()
    api.callAPI(newString)
    return str(wordList)

# class Task(BaseModel):
#     id: Optional[UUID] = None
#     title: str
#     description: Optional[str] = None
#     completed: bool = False

# tasks = []

# @app.post('/tasks/', response_model=Task)
# def create_task(task: Task):
#     task.id = uuid4()
#     tasks.append(task)
#     return task

# @app.get('/tasks/', response_model=List[Task])
# def read_task():
#     return tasks

# @app.get('/tasks/{task_id}', response_model=Task)
# def read_task(task_id:UUID):
#     for task in tasks:
#         if task.id == task_id:
#             return task
#     raise HTTPException(status_code=404, detail='Task Not Found')

# @app.put('/tasks/{task_id}', response_model=Task)
# def update_task(task_id:UUID, task_update:Task):
#     for idx, task in enumerate(tasks):
#         if task.id == task_id:
#             updated_task = task.copy(update=task_update.model_dump(exclude_unset=True))
#             task[idx] = update_task
#             return update_task
#     raise HTTPException(status_code=404, detail='Task not found')

# @app.delete('/tasks/{task_id}', response_model=Task)
# def delete_task(task_id):
#     for idx, task in enumerate(tasks):
#         if task.id == task_id:
#             return tasks.pop(idx)
#     raise HTTPException(status_code=404, detail='Task not found')
    

# @app.get('/')
# async def read():
#     return {"Hello":"World"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app=app, host='0.0.0.0', port=8080)
