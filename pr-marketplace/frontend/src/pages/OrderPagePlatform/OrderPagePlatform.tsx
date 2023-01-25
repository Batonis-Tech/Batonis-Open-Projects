import React, {FC, useEffect, useRef, useState} from 'react';
import classes from './OrderPagePlatform.module.scss'
import Header from "../../components/Header/Header";
import {ReactComponent as LeftArrow} from "../../assets/svg/LeftArrow.svg";
import {ReactComponent as BillSVG} from "../../assets/svg/Bill.svg";
import {ReactComponent as RightArrowSVG} from "../../assets/svg/RightArrow.svg";
import AttachSVG from "../../assets/svg/Attach.svg"
import {InputText} from "primereact/inputtext";
import clsx from "clsx";
import {Card} from "primereact/card";
import {ordersAPI} from "../../api/api";
import {Link, useNavigate, useParams} from "react-router-dom";

import 'stream-chat-react/dist/css/index.css';
import { StreamChat } from 'stream-chat';
import {useAppSelector} from "../../hooks/reduxHooks";
import {
    Chat,
    Channel,
    ChannelHeader,
    MessageInput,
    MessageInputSmall,
    VirtualizedMessageList,
    Window,
    Thread,
    LoadingIndicator, useTranslationContext, CustomStyles, ChannelHeaderProps, useChannelStateContext, TypingIndicator
} from 'stream-chat-react';
import moment from "moment";
import {Skeleton} from "primereact/skeleton";
import {Button} from "primereact/button";
import ModalQuillTask from "../../components/Modals/ModalQuillTask/ModalQuillTask";
import ModalQuillSolution from "../../components/Modals/ModalQuillSolution/ModalQuillSolution";
import ModalAddUrlPub from "../../components/Modals/ModalAddURLPub/ModalAddURLPub";
import {Toast} from "primereact/toast";
import {ReactComponent as CloseSVG} from "../../assets/svg/Close.svg";
import {ReactComponent as ProcessSVG} from "../../assets/svg/Process.svg";
import {ReactComponent as ClockSVG} from "../../assets/svg/Clock.svg";
import {ReactComponent as Clock2SVG} from "../../assets/svg/Clock2.svg";
import {ReactComponent as NewsPaperSVG} from "../../assets/svg/NewsPaper.svg";
import {ReactComponent as CheckSVG} from "../../assets/svg/Check.svg";

const customStyles: CustomStyles = {
    '--primary-color': '#FFB300',
    '--primary-color-faded': "rgba(255,179,0,0.27)"
};

const OrderPagePlatform: FC = () => {
    const [search, setSearch] = useState<string>("")
    const [order, setOrder] = useState<any>(null)
    const [isFetchingGetOrder, setIsFetchingGetOrder] = useState(false)
    const {orderId} = useParams()
    const user = useAppSelector(state => state.userReducer.userData)
    const currentAccount = useAppSelector(state => state.userReducer.currentAccount)

    const [chatClient, setChatClient] = useState<any>(null);
    const [channel, setChannel] = useState<any>(null);

    const [showModalQuillTask, setShowModalQuillTask] = useState(false)
    const [showModalQuillSolution, setShowModalQuillSolution] = useState(false)
    const [showModalAddUrlPub, setShowModalAddUrlPub] = useState(false)

    const [fetchRejectOrder, setFetchRejectOrder] = useState(false)
    const [fetchStartOrder, setFetchStartOrder] = useState(false)
    const [fetchCheckPubTextOrder, setFetchCheckPubTextOrder] = useState(false)

    const navigate = useNavigate()

    const toastRef = useRef<Toast>(null)

    useEffect(()=>{
        const initChat = async (chatId: any) => {
            const client = StreamChat.getInstance('tk3er9ueepmy');
            if(user){
                await client.connectUser(
                    {
                        id: user.chat_user_id as string,
                        name: user.name as string,
                        image: `https://getstream.io/random_png/?id=${user.chat_user_id as string}&name=${user.name as string}`,
                    },
                    user.chat_token,
                );
            }
            const tempChannel = await client.channel("messaging", chatId)
            setChannel(tempChannel)
            setChatClient(client);
        };
        setIsFetchingGetOrder(true)
        ordersAPI.getOrder(orderId, currentAccount?.data?.id as number)
            .then(response => {
                setOrder(response.data)
                initChat(response.data.chat)
                setIsFetchingGetOrder(false)
            })
            .catch(error => {
                navigate("/")
                setIsFetchingGetOrder(false)
            })
    }, [])

    const CustomFileUploadIcon = () => {
        const { t } = useTranslationContext();
        return (
            <div>
                <img src={AttachSVG} alt={t('Прикрепить файл')} style={{width: 16, height: 16}}/>
            </div>
        );
    };

    const refreshOrder = () => {
        ordersAPI.getOrder(orderId)
            .then(response => {
                setOrder(response.data)
                setIsFetchingGetOrder(false)
            })
            .catch(error => {
                navigate("/")
                setIsFetchingGetOrder(false)
            })
    }

    const rejectOrder = () => {
        setFetchRejectOrder(true)
        ordersAPI.setActionOrderPlatform(orderId, "reject")
            .then(response => {
                toastRef?.current?.show({severity: 'success', summary: 'Заказ отклонен'})
            })
            .catch(error => {
                toastRef?.current?.show({severity: 'error', summary: 'Заказ не был отклонен'})
            })
            .finally(() => {
                refreshOrder()
                setFetchRejectOrder(false)
            })
    }

    const startOrder = () => {
        setFetchStartOrder(true)
        ordersAPI.setActionOrderPlatform(orderId, "start")
            .then(response => {
                toastRef?.current?.show({severity: 'success', summary: 'Заказ принят'})
            })
            .catch(error => {
                toastRef?.current?.show({severity: 'error', summary: 'Заказ не был принят'})
            })
            .finally(() => {
                refreshOrder()
                setFetchStartOrder(false)
            })
    }

    const checkPubTextOrder = () => {
        setFetchCheckPubTextOrder(true)
        ordersAPI.setActionOrderPlatform(orderId, "to_check")
            .then(response => {
                toastRef?.current?.show({severity: 'success', summary: 'Отправлено на согласование'})
            })
            .catch(error => {
                toastRef?.current?.show({severity: 'error', summary: 'Не отправлено на согласование'})
            })
            .finally(() => {
                refreshOrder()
                setFetchCheckPubTextOrder(false)
            })
    }

    const CustomChannelHeader = (props: ChannelHeaderProps) => {
        const { title } = props;

        const { channel } = useChannelStateContext();
        const { name } = channel.data || {};

        return (
            <div className='str-chat__header-livestream'>
                <div>
                    <div className='header-item'>
                        {title || name}
                    </div>
                    <TypingIndicator />
                </div>
            </div>
        );
    };

    return (
        <>
            <Header/>
            <div className={classes.container}>
                <Link to={"/orders"} className={classes.LinkBack}><LeftArrow/> Вернуться к списку заказов</Link>
                <div className={classes.cols}>
                    <div className={classes.chatInner}>
                        {!chatClient || !channel || !order?
                            <LoadingIndicator />:
                            <Chat client={chatClient} theme='livestream light' customStyles={customStyles}>
                                <Channel channel={channel} FileUploadIcon={CustomFileUploadIcon}>
                                    <Window>
                                        <CustomChannelHeader title={order?.user?.name} />
                                        <VirtualizedMessageList />
                                        <MessageInput Input={MessageInputSmall}/>
                                    </Window>
                                    <Thread />
                                </Channel>
                            </Chat>
                        }
                    </div>
                    <div className={classes.sidebarRight}>
                        <Card
                            title={(<div className={classes.cardTitle}>Детали заказа</div>)}
                            subTitle={(<div className={classes.cardSubtitle}>Дата создания {order?.created ? moment(new Date(order?.created)).format("DD.MM.YY"): (<Skeleton height={"20px"} width={"60px"}/>)}</div>)}
                            className={classes.card}
                        >
                            {order ?
                                <div className={classes.cardTypeOrder}>
                                    {order.status === "Оплачено" &&
                                        <>
                                            <BillSVG/>
                                            <div className={classes.cardTypeOrderText}>{order.status}</div>
                                        </>
                                    }
                                    {order.status === "Ожидает оплаты" &&
                                        <>
                                            <BillSVG/>
                                            <div className={classes.cardTypeOrderText}>{order.status}</div>
                                        </>
                                    }
                                    {order.status === "Отклонен" &&
                                        <>
                                            <CloseSVG className={classes.red}/>
                                            <div className={clsx(classes.cardTypeOrderText, classes.red)}>{order.status}</div>
                                        </>
                                    }
                                    {order.status === "Отменен" &&
                                        <>
                                            <CloseSVG/>
                                            <div className={classes.cardTypeOrderText}>{order.status}</div>
                                        </>
                                    }
                                    {order.status === "Принят в работу" &&
                                        <>
                                            <ProcessSVG/>
                                            <div className={classes.cardTypeOrderText}>{order.status}</div>
                                        </>
                                    }
                                    {order.status === "Ожидает согласования" &&
                                        <>
                                            <ClockSVG/>
                                            <div className={classes.cardTypeOrderText} style={{color: "#F8BB54"}}>{order.status}</div>
                                        </>
                                    }
                                    {order.status === "Ожидает публикации" &&
                                        <>
                                            <Clock2SVG/>
                                            <div className={classes.cardTypeOrderText} style={{color: "#F8BB54"}}>{order.status}</div>
                                        </>
                                    }
                                    {order.status === "Опубликован" &&
                                        <>
                                            <NewsPaperSVG className={classes.blue}/>
                                            <div className={classes.cardTypeOrderText} style={{color: "#76A8F9"}}>{order.status}</div>
                                        </>
                                    }
                                    {order.status === "Завершен" &&
                                        <>
                                            <CheckSVG/>
                                            <div className={classes.cardTypeOrderText} style={{color: "#2AD168"}}>{order.status}</div>
                                        </>
                                    }
                                </div>:
                                <Skeleton className={classes.cardTypeOrder} width={"100px"} height={"27px"}/>
                            }
                            <div className={classes.cardInfoInner}>
                                <div className={classes.cardInfoTitle}>Тип публикации</div>
                                {order ?
                                    <div className={classes.cardInfoDesc}>{order.product.type.name}</div>:
                                    <Skeleton className={classes.cardInfoDesc} width={"100px"} height={"18px"}/>
                                }

                            </div>
                            <div className={classes.cardPayment}>
                                <div className={classes.cardPaymentRow}>
                                    <div className={classes.cardPaymentMainTitle}>Оплачено</div>
                                    {order ?
                                        <div className={classes.cardPaymentMainPrice}>{(+order.total_cost).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>:
                                        <Skeleton className={classes.cardPaymentMainPrice} width={"100px"} height={"18px"}/>
                                    }
                                </div>
                                {order ?
                                    <>
                                        <div className={classes.cardPaymentRow}>
                                            <div className={classes.cardPaymentTitle}>{order.product.type.name}</div>
                                            <div className={classes.cardPaymentPrice}>{(+order.product.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
                                        </div>
                                        {(order?.options as Array<any>).map(option => {
                                            return(
                                                <div key={`option${option?.option?.id}`} className={classes.cardPaymentRow} style={{alignItems: "start"}}>
                                                    <div className={classes.cardPaymentTitle}>{option?.option?.name}</div>
                                                    <div className={classes.cardPaymentPrice}>{(+option?.option?.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
                                                </div>
                                            )
                                        })}
                                    </>:
                                    <>
                                        <div className={classes.cardPaymentRow}>
                                            <Skeleton width={"180px"}/>
                                            <Skeleton width={"100px"}/>
                                        </div>
                                        <div className={classes.cardPaymentRow}>
                                            <Skeleton width={"150px"}/>
                                            <Skeleton width={"80px"}/>
                                        </div>
                                        <div className={classes.cardPaymentRow}>
                                            <Skeleton width={"130px"}/>
                                            <Skeleton width={"110px"}/>
                                        </div>
                                    </>
                                }
                            </div>
                        </Card>
                        <div className={classes.btn} onClick={()=>setShowModalQuillTask(true)}>
                            <div>Задание</div>
                            <RightArrowSVG/>
                        </div>
                        {order && order.status !== "Оплачено" && order.status !== "Ожидает оплаты" &&
                            <div className={classes.btn} onClick={()=>setShowModalQuillSolution(true)}>
                                <div>Текст публикации</div>
                                <RightArrowSVG/>
                            </div>
                        }
                        {(order && ((order.status === "Ожидает публикации" && order.publication_url) || order.status === "Опубликован" || order.status === "Завершен")) &&
                            <div className={classes.btn} onClick={()=>setShowModalAddUrlPub(true)}>
                                <div>Публикация</div>
                                <RightArrowSVG/>
                            </div>
                        }
                        {order && order.status === "Оплачено" &&
                            <Button
                                className={clsx(classes.btnVoid)}
                                label={"Взять в работу"}
                                onClick={startOrder}
                                loading={fetchStartOrder}
                            />
                        }
                        {order && order.status === "Оплачено" &&
                            <Button
                                className={clsx("p-button-text", classes.btnVoid)}
                                label={"Отклонить заказ"}
                                onClick={rejectOrder}
                                loading={fetchRejectOrder}
                            />
                        }
                        {order && order.status === "Принят в работу" &&
                            <Button
                                className={clsx(classes.btnVoid)}
                                label={"Отправить на согласовние"}
                                onClick={checkPubTextOrder}
                                loading={fetchCheckPubTextOrder}
                            />
                        }
                        {order && (order.status === "Ожидает публикации" && !order.publication_url) &&
                            <Button
                                className={clsx(classes.btnVoid)}
                                label={"Добавить ссылку"}
                                onClick={()=> setShowModalAddUrlPub(true)}
                            />
                        }
                    </div>
                </div>
            </div>
            <ModalQuillTask
                visible={showModalQuillTask}
                onHide={()=>setShowModalQuillTask(false)}
                value={order?.quill_task as string}
                readOnlyProp={true}
                toastRef={toastRef}
            />
            <ModalQuillSolution
                visible={showModalQuillSolution}
                onHide={()=>setShowModalQuillSolution(false)}
                value={order?.quill_solution as string}
                setValue={(text) => {
                    setOrder({...order, quill_solution: text })
                }}
                showSave={true}
                toastRef={toastRef}
                orderId={orderId}
                refreshOrder={refreshOrder}
            />
            <ModalAddUrlPub
                visible={showModalAddUrlPub}
                onHide={()=>setShowModalAddUrlPub(false)}
                value={order?.publication_url as string}
                setValue={text => {
                    setOrder({...order, publication_url: text })
                }}
                toastRef={toastRef}
                orderId={orderId}
                refreshOrder={refreshOrder}
            />
            <Toast ref={toastRef} position="bottom-right"/>
        </>
    );
};

export default OrderPagePlatform;