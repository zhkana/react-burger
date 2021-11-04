import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import style from './burger-constructor.module.css';
import { Button, CurrencyIcon, ConstructorElement } from "@ya.praktikum/react-developer-burger-ui-components";
import Modal from "../modal/modal";
import OrderDetails from "../order-details/order-details";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from 'uuid';
import BurgerConstructorItem from "../burger-constructor-item/burger-constructor-item";
import { ADD_BUN_TO_CONSTRUCTOR, ADD_INGREDIENT_TO_CONSTRUCTOR, CLEAR_CONSTRUCTOR, CLEAR_ORDER, postOrder } from "../../services/actions/burger-constructor";
import { TBurgerConstructorProps } from '../../utils/prop-types';

export default function BurgerConstructor() {  
    const [modalActive, setModalActive] = useState<boolean>(false);

    const { ingredients, bun, order, isAuth }: any = useSelector<any>(state => ({
        ingredients: state.burgerConstructor.ingredients,
        bun: state.burgerConstructor.bun,
        order: state.burgerConstructor.order,
        isAuth: state.usersData.isAuth      
    }));
    const dispatch = useDispatch();
    const history = useHistory();

    function moveIngredient (ingredient: TBurgerConstructorProps) {
        dispatch({ type: ingredient.type === 'bun' ? ADD_BUN_TO_CONSTRUCTOR : ADD_INGREDIENT_TO_CONSTRUCTOR,
            item: {...ingredient, uuid: uuidv4()}
        })
    }
    const [{ isHover }, dropTarget] = useDrop({
        accept: 'ingredients',
        collect: monitor => ({ isHover: monitor.isOver() }),
        drop(item: TBurgerConstructorProps) { moveIngredient(item); }
    });
    function handleOpenModal () {
        if (!isAuth) {
            history.push('/login');
        }        
        if (!bun) { return alert('Выберите булочку'); }
        const idsArr = [...ingredients.map((item: TBurgerConstructorProps) => item._id), bun._id, bun._id];
        dispatch(postOrder(idsArr));
        setModalActive(true)
    }
    function handleCloseModal () {
        dispatch({ type: CLEAR_ORDER })
        dispatch({ type: CLEAR_CONSTRUCTOR })
        setModalActive(false);
    }
    const totalPrice = useMemo(() => {
        let price = ingredients.reduce((acc: number, item: TBurgerConstructorProps) => { return item.price + acc; }, 0);
        price += bun && bun.price * 2;
        return price;
    }, [ingredients, bun])

    return (
        <>
            <div ref={dropTarget} className={`${style.constructor} mt-25`}>
                <ul className={`${style.list}`}>
                    <li className={`${style.item} ${isHover ? style.item_isHovering : ''}`}>
                        {bun ? (                        
                            <ConstructorElement type="top" isLocked={true} text={`${bun.name} (верх)`} price={bun.price} thumbnail={bun.image} />
                        ) : (
                            <div className={`${style.nobun_top} text text_type_main-default`}><p>Выберите булочку</p></div>
                        )}                        
                    </li>
                    <li className={`${style.item} ${isHover ? style.item_isHovering : ''}`}>
                        <ul className={style.list__scroll} style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: "flex-end"}}>
                            {ingredients.map((item :TBurgerConstructorProps, idx: number) => {
                                return <BurgerConstructorItem {...item} index={idx} key={item.uuid} />
                            })}
                        </ul>
                    </li>                    
                    <li className={`${style.item} ${isHover ? style.item_isHovering : ''}`}>
                        {bun ? (
                            <ConstructorElement type="bottom" isLocked={true} text={`${bun.name} (низ)`} price={bun.price} thumbnail={bun.image} />
                        ) : (
                            <div className={`${style.nobun_bottom} text text_type_main-default`}><p>Выберите булочку</p></div>
                        )}
                    </li>
                </ul>
                {(ingredients || bun) && (
                    <div className={`${style.price__box} mr-8`}>
                        <div className={`${style.price} mr-10`}>
                            <span className="text text_type_digits-medium">{totalPrice}</span>
                            <CurrencyIcon type="primary" />
                        </div>
                        <Button type="primary" size="medium" onClick={handleOpenModal}>Оформить заказ</Button>
                    </div>
                )}
            </div>
            {modalActive && order && (
                <Modal onClose={handleCloseModal}>
                    <OrderDetails id={order} />
                </Modal>
            )}
        </>
    );
}