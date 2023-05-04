
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHttp } from '../../hooks/http.hook'
import { changeActiveFilter, filtersFetch, selectAll } from "./filtersSlice";
import Spinner from '../spinner/Spinner';
import classNames from "classnames";
import store from '../../store'



const HeroesFilters = () => {
   const { request } = useHttp()
   const dispatch = useDispatch()
   const { filtersLoadingStatus, activeFilter } = useSelector(state => state.filters)
   const filters = selectAll(store.getState())

   useEffect(() => {
      dispatch(filtersFetch());

      // eslint-disable-next-line
   }, []);

   if (filtersLoadingStatus === "loading") {
      return <Spinner />;
   } else if (filtersLoadingStatus === "error") {
      return <h5 className="text-center mt-5">Ошибка загрузки</h5>
   }

   const renderButtons = (arr) => {
      if (arr.length === 0) {
         return <h5 className="text-center mt-5">Фильтров пока нет</h5>
      }

      return arr.map(({ label, name, className }) => {
         const btnClass = classNames('btn', className, { 'active': name === activeFilter })
         return <button
            onClick={() => dispatch(changeActiveFilter(name))}
            className={btnClass}
            key={name}
            value={name}>{label}</button>
      })
   }

   const elements = renderButtons(filters)

   return (
      <div className="card shadow-lg mt-4">
         <div className="card-body">
            <p className="card-text">Отфильтруйте героев по элементам</p>
            <div className="btn-group">
               {elements}
            </div>
         </div>
      </div>
   )
}

export default HeroesFilters;