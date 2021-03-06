import { createRef, useState, SyntheticEvent, useMemo } from 'react';
import style from './burger-ingredients.module.css';
import BurgerIngrediensDetail from "../burger-ingredients-detail/burger-ingredients-detail";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import { useSelector } from '../../services/types';

export default function BurgerIngredients() { 
    const [current, setCurrent] = useState<string>('bun');
    const { ingredients, ingredientsRequest, ingredientsFailed } = useSelector((state)=> state.burgerIngredients) 
    const bunsRef = createRef<HTMLDivElement>();
    const saucesRef = createRef<HTMLDivElement>();
    const mainsRef  = createRef<HTMLDivElement>(); 
    const scrollRef = createRef<HTMLDivElement>();    

    function handleTabClick (value: string) { 
        setCurrent(value); 
    }
    function handleScroll (e: SyntheticEvent) {           
        const scrollContainer = scrollRef.current;
        const saucesContainer = saucesRef.current?.getBoundingClientRect();
        const mainsContainer = mainsRef.current?.getBoundingClientRect();
        if (scrollContainer !== null && saucesContainer && mainsContainer) {
            if (scrollContainer.offsetTop - saucesContainer.top < 0) {
                setCurrent('bun');
            } else if (scrollContainer.offsetTop - mainsContainer.top < 0) {
                setCurrent('sauce');
            } else {
                setCurrent('main');
            }
        }
    }
    const bunsList = useMemo(() => {
        return ingredients.filter((item) => item.type === 'bun')
    }, [ingredients])    

    const saucesList = useMemo(() => {
        return ingredients.filter((item) => item.type === 'sauce')
    }, [ingredients])  

    const mainsList = useMemo(() => {
        return ingredients.filter((item) => item.type === 'main')
    }, [ingredients])  

    return (
        <>
            {ingredientsRequest && !ingredientsFailed && ( <h1>Идет загрузка...</h1> )}
            {ingredientsFailed && !ingredientsRequest && ( <h1>Произошла ошибка, попробуйте позже...</h1> )}
            {!ingredientsFailed && !ingredientsRequest && ingredients.length > 0 && (
                <div className={style.construct}>
                    <h1 className="text text_type_main-large mt-10">Соберите бургер</h1>
                    <div style={{ display: 'flex' }} className='mt-5'>
                        <a className={style.link} href="#bun">
                            <Tab value="bun" active={current === 'bun'} onClick={handleTabClick}>Булка</Tab>
                        </a>
                        <a className={style.link} href="#sauce">
                            <Tab value="sauce" active={current === 'sauce'} onClick={handleTabClick}>Соусы</Tab>
                        </a>
                        <a className={style.link} href="#main">
                            <Tab value="main" active={current === 'main'} onClick={handleTabClick}>Начинки</Tab>
                        </a>
                    </div>
                    <div className="mt-10">
                        <div className={style.products} onScroll={handleScroll} ref={scrollRef}>
                            <h3 className="text text_type_main-medium" ref={bunsRef} id="bun">Булки</h3>
                            <div className={style.products__cont}>
                                {bunsList.map((item) => <BurgerIngrediensDetail {...item} key={item._id} />)}
                            </div>
                            <h3 className="text text_type_main-medium" ref={saucesRef} id="sauce">Соусы</h3>
                            <div className={style.products__cont}>
                                {saucesList.map((item) => <BurgerIngrediensDetail {...item} key={item._id} />)}
                            </div>
                            <h3 className="text text_type_main-medium" ref={mainsRef} id="main">Начинки</h3>
                            <div className={style.products__cont}>
                                {mainsList.map((item) => <BurgerIngrediensDetail {...item} key={item._id} />)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
