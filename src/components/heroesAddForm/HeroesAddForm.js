
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { useHttp } from '../../hooks/http.hook'
import { useState } from 'react';
import { heroCreated } from '../heroesList/heroesSlice';
import { selectAll } from '../heroesFilters/filtersSlice';
import store from '../../store'

const HeroesAddForm = () => {
   const [name, setName] = useState('')
   const [description, setDescription] = useState('')
   const [element, setElement] = useState('')
   const { request } = useHttp()
   const dispatch = useDispatch()
   const filters = selectAll(store.getState())


   const onSubmitHandler = (e) => {
      e.preventDefault()

      const hero = {
         id: uuidv4(),
         name,
         description,
         element
      }

      request('http://localhost:3001/heroes', 'POST', JSON.stringify(hero))
         .then(dispatch(heroCreated(hero)))
         .catch(err => console.log(err))

      setName('')
      setDescription('')
      setElement('')
   }

   const renderOptions = (arr) => {

      if (arr && arr.length <= 0) {
         return <option >Фильтров пока нет...</option>
      }

      return arr.map(({ label, name }) => {
         if (name === 'all') return

         return <option key={name} id={name} value={name}>{label}</option>
      })
   }

   const elements = renderOptions(filters)

   return (
      <form onSubmit={onSubmitHandler} className="border p-4 shadow-lg rounded">
         <div className="mb-3">
            <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
            <input
               required
               type="text"
               name="name"
               className="form-control"
               id="name"
               value={name}
               placeholder="Как меня зовут?"
               onChange={(e) => setName(e.target.value)} />
         </div>

         <div className="mb-3">
            <label htmlFor="description" className="form-label fs-4">Описание</label>
            <textarea
               required
               name="description"
               className="form-control"
               id="description"
               value={description}
               placeholder="Что я умею?"
               style={{ "height": '130px' }}
               onChange={(e) => setDescription(e.target.value)} />
         </div>

         <div className="mb-3">
            <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
            <select
               required
               className="form-select"
               id="element"
               name="element"
               value={element}
               onChange={(e) => setElement(e.target.value)} >
               <option >Я владею элементом...</option>
               {elements}
            </select>
         </div>

         <button type="submit" className="btn btn-primary">Создать</button>
      </form>
   )
}

export default HeroesAddForm;