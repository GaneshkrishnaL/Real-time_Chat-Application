import axios from 'axios'
import { useFormik } from 'formik'
import _ from 'lodash'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { User } from 'react-feather'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import * as Yup from 'yup'
import TextField from '../components/TextField'
import { API_URL } from '../utils/constants'

type Message = {
    id: number
    from: number
    to: number
    text: string
}

type User = {
    id: number
    name: string
    email: string
    chats: any
    Chat: any
    messages: Message[]
}

const validationSchema = Yup.object().shape({
    text: Yup.string().required(),
})

const validationSchema1 = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(8).max(20).required(),
})

const socket = io(`${API_URL}`, {
    transports: ['websocket'],
})

const Chat: FC = () => {
    const [user, setUser] = useState<User>()
    const navigate = useNavigate()
    useEffect(() => {
        ;(async () => {
            const res = await axios.get(`${API_URL}auth/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('@token')}`,
                },
            })

            setUser(res.data?.user)
        })()
    }, [])

    const [searchParams, setSearchParams] = useSearchParams()

    const [userChats, setUserChats] = useState([])
    useEffect(() => {
        if (user?.chats) setUserChats(user?.chats)
    }, [user])

    const [connected, setConnected] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>()
    useEffect(() => {
        socket.on('connect', () => setConnected(true))
        socket.on('disconnect', () => setConnected(false))

        return () => {
            socket.off('connect')
            socket.off('disconnect')
        }
    }, [])

    useEffect(() => {
        const messagesContainer = document.getElementById('messages')
        messagesContainer?.scrollTo(
            0,
            messagesContainer?.scrollHeight as number
        )

        socket.on('receive-message', (payload) => {
            const li = document.createElement('div')
            li.textContent = payload?.text
            if (payload?.from === user?.id)
                li.setAttribute(
                    'class',
                    'justify-self-end bg-blue-100 px-5 py-4 rounded-xl'
                )
            else
                li.setAttribute(
                    'class',
                    'justify-self-start bg-blue-100 px-5 py-4 rounded-xl'
                )
            messagesContainer?.appendChild(li)
            messagesContainer?.scrollTo(
                0,
                messagesContainer?.scrollHeight as number
            )
        })

        return () => {
            socket.off('receive-message')
        }
    }, [messages])

    useEffect(() => {
        if (
            user?.chats?.filter(
                (_chat: any) =>
                    _chat?.id === parseInt(searchParams.get('with') as string)
            ).length > 0
        ) {
            setMessages(
                user?.chats?.filter(
                    (_chat: any) =>
                        _chat?.id ===
                        parseInt(searchParams.get('with') as string)
                )[0]?.messages
            )
        } else if (
            user?.Chat?.filter(
                (_chat: any) =>
                    _chat?.id === parseInt(searchParams.get('with') as string)
            ).length > 0
        ) {
            setMessages(
                user?.Chat?.filter(
                    (_chat: any) =>
                        _chat?.id ===
                        parseInt(searchParams.get('with') as string)
                )[0]?.messages
            )
        }
    }, [user, searchParams])

    const [users, setUsers] = useState<User[]>()
    const searchUsers = _.debounce(async (query: string) => {
        if (!query) return setUsers([])

        const res = await axios.get(`${API_URL}auth/users?q=${query}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('@token')}`,
            },
        })
        if (res.status === 200) setUsers(res.data?.users)
    }, 500)

    const formik = useFormik({
        initialValues: {
            text: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log(values)
            if (connected) {
                socket.emit('send-message', {
                    chatId: parseInt(searchParams.get('with') as string),
                    from: user?.id,
                    text: values.text,
                })
                document
                    .getElementById('messages')
                    ?.scrollIntoView({ block: 'end' })
                resetForm()
            }
        },
    })

    const formik1 = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: validationSchema1,
        onSubmit: async (values) => {
            try {
                const res = await axios.patch(`${API_URL}auth/user`, values, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            '@token'
                        )}`,
                    },
                })

                return setUser(res.data?.data)
            } catch (error) {
                console.log(error)
            }
        },
    })
    useEffect(() => {
        if (user) {
            formik1.setFieldValue('name', user?.name)
            formik1.setFieldValue('email', user?.email)
        }
    }, [user])

    return localStorage.getItem('@token') ? (
        <div className="p-5 h-screen grid items-center">
            <div className="border h-[900px] chatbox rounded-xl">
                {/* contacts section */}
                <div className="border-r p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-4">
                            <div className="w-[60px] aspect-square bg-gray-100 rounded-full grid place-items-center">
                                <User />
                            </div>
                            <section className="grid gap-y-0.5">
                                <h1 className="text-lg font-bold text-blue-500">
                                    {user?.name}
                                </h1>
                                <p>{user?.email}</p>
                            </section>
                        </div>
                    </div>

                    <div className="mt-6 mb-8">
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search people..."
                            className="border px-5 py-4 rounded-xl w-full"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                searchUsers(e.currentTarget.value)
                            }
                        />
                    </div>

                    <div className="grid gap-y-2.5">
                        {(users as any)?.length > 0 ? (
                            <>
                                {users?.map((_user: any) => (
                                    <section
                                        key={_user?.id}
                                        className="flex items-center cursor-pointer justify-between flex-wrap"
                                        onClick={() => {
                                            if (
                                                _user?.chats?.filter(
                                                    (_chat: any) =>
                                                        _chat?.contactId ===
                                                        user?.id
                                                )?.length > 0
                                            ) {
                                                setSearchParams(
                                                    'with=' +
                                                        _user?.chats?.filter(
                                                            (_chat: any) =>
                                                                _chat?.contactId ===
                                                                user?.id
                                                        )[0].id
                                                )
                                                window.location.reload()
                                            } else if (
                                                _user?.Chat?.filter(
                                                    (_chat: any) =>
                                                        _chat?.userId ===
                                                        user?.id
                                                )?.length > 0
                                            ) {
                                                setSearchParams(
                                                    'with=' +
                                                        _user?.Chat?.filter(
                                                            (_chat: any) =>
                                                                _chat?.userId ===
                                                                user?.id
                                                        )[0].id
                                                )
                                                window.location.reload()
                                            }
                                        }}
                                    >
                                        <div className="flex gap-3.5 p-2.5 flex-wrap">
                                            <div className="w-[60px] aspect-square bg-gray-100 rounded-full grid place-items-center">
                                                <User />
                                            </div>
                                            <section className="grid">
                                                <h2 className="font-bold text-blue-500">
                                                    {_user?.name}
                                                </h2>
                                                <p>{_user?.email}</p>
                                            </section>
                                        </div>
                                        {_user?.chats?.filter(
                                            (_chat: any) =>
                                                _chat?.contactId === user?.id
                                        )?.length > 0 ? (
                                            <></>
                                        ) : _user?.Chat?.filter(
                                              (_chat: any) =>
                                                  _chat?.userId === user?.id
                                          )?.length > 0 ? (
                                            <></>
                                        ) : (
                                            <button
                                                className="text-blue-500 underline"
                                                onClick={async () => {
                                                    const res =
                                                        await axios.post(
                                                            `${API_URL}chats`,
                                                            {
                                                                contactId:
                                                                    _user?.id,
                                                            },
                                                            {
                                                                headers: {
                                                                    Authorization: `Bearer ${localStorage.getItem(
                                                                        '@token'
                                                                    )}`,
                                                                },
                                                            }
                                                        )
                                                    setUserChats([
                                                        ...userChats,
                                                        res.data?.data,
                                                    ] as any)
                                                    setUsers([])
                                                }}
                                            >
                                                Add friend
                                            </button>
                                        )}
                                    </section>
                                ))}
                            </>
                        ) : (
                            <>
                                {userChats?.map((chat: any) => (
                                    <section
                                        key={chat?.id}
                                        className={`flex items-center cursor-pointer justify-between p-2.5 rounded-lg ${
                                            chat?.id ===
                                            parseInt(
                                                searchParams.get(
                                                    'with'
                                                ) as string
                                            )
                                                ? 'bg-blue-50'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            setSearchParams('with=' + chat?.id)
                                            window.location.reload()
                                        }}
                                    >
                                        <div className="flex gap-x-3.5">
                                            <div className="w-[60px] aspect-square bg-gray-100 rounded-full grid place-items-center">
                                                <User />
                                            </div>
                                            <section className="grid">
                                                <h2 className="font-bold text-blue-500">
                                                    {chat?.contact?.name}
                                                </h2>
                                                <p>{chat?.contact?.email}</p>
                                            </section>
                                        </div>
                                    </section>
                                ))}
                                {user?.Chat?.map((chat: any) => (
                                    <section
                                        key={chat?.id}
                                        className={`flex items-center cursor-pointer justify-between p-2.5 rounded-lg ${
                                            chat?.id ===
                                            parseInt(
                                                searchParams.get(
                                                    'with'
                                                ) as string
                                            )
                                                ? 'bg-blue-50'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            setSearchParams('with=' + chat?.id)
                                            window.location.reload()
                                        }}
                                    >
                                        <div className="flex gap-x-3.5">
                                            <div className="w-[60px] aspect-square bg-gray-100 rounded-full grid place-items-center">
                                                <User />
                                            </div>
                                            <section className="grid">
                                                <h2 className="font-bold text-blue-500">
                                                    {chat?.user?.name}
                                                </h2>
                                                <p>{chat?.user?.email}</p>
                                            </section>
                                        </div>
                                    </section>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* messages section */}
                <section className="flex flex-col h-[900px]">
                    <div className="flex-1"></div>
                    <div
                        id="messages"
                        className="grid px-8 mt-8 gap-2.5 overflow-y-scroll"
                    >
                        {(messages as any)?.length > 0 &&
                            messages?.map((message: Message) => (
                                <div
                                    key={message?.id}
                                    className={`max-w-md ${
                                        message?.from === user?.id
                                            ? 'justify-self-end'
                                            : 'justify-self-start'
                                    }`}
                                >
                                    <p className="bg-blue-100 px-5 py-4 rounded-xl">
                                        {message?.text}
                                    </p>
                                </div>
                            ))}
                    </div>

                    <div className="px-8 pb-8">
                        {searchParams.get('with') ? (
                            <form
                                className="flex items-center gap-3.5 mt-8"
                                onSubmit={formik.handleSubmit}
                            >
                                <input
                                    type="text"
                                    name="text"
                                    id="text"
                                    placeholder="Type message"
                                    className="border px-5 py-4 rounded-xl w-full"
                                    value={formik.values.text}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-5 py-4 rounded-xl"
                                >
                                    Send
                                </button>
                            </form>
                        ) : (
                            <form className="flex items-center gap-3.5 mt-8">
                                <input
                                    type="text"
                                    name="text"
                                    id="text"
                                    placeholder="Type message"
                                    className="border px-5 py-4 rounded-xl w-full"
                                    disabled
                                />
                                <button
                                    className="disabled:bg-blue-300 text-white px-5 py-4 rounded-xl"
                                    disabled
                                >
                                    Send
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                <div className="border-l p-8 overflow-y-scroll">
                    <section className="grid place-items-center mt-8">
                        <div className="w-[150px] aspect-square rounded-full bg-gray-100 grid place-items-center">
                            <User />
                        </div>
                        <section className="text-center mt-6">
                            <h1 className="text-xl font-bold mb-1 text-blue-500">
                                {user?.name}
                            </h1>
                            <p>{user?.email}</p>
                        </section>
                    </section>

                    <form
                        className="grid mt-12 details"
                        onSubmit={formik1.handleSubmit}
                    >
                        <TextField
                            label="Name"
                            type="name"
                            id="name"
                            name="name"
                            value={formik1.values.name}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            error={
                                formik1.touched.name && formik1.errors.name
                                    ? formik1.errors.name
                                    : ''
                            }
                        />
                        <TextField
                            label="Email"
                            type="email"
                            id="email"
                            name="email"
                            value={formik1.values.email}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            error={
                                formik1.touched.email && formik1.errors.email
                                    ? formik1.errors.email
                                    : ''
                            }
                        />
                        <TextField
                            label="Password"
                            type="password"
                            id="password"
                            name="password"
                            value={formik1.values.password}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            error={
                                formik1.touched.password &&
                                formik1.errors.password
                                    ? formik1.errors.password
                                    : ''
                            }
                        />

                        <input
                            type="submit"
                            value="Update"
                            className="bg-blue-500 rounded p-4 text-white"
                        />

                        <button
                            type="button"
                            className="border border-red-500 p-4 rounded text-red-500"
                            onClick={() => {
                                localStorage.removeItem('@token')
                                navigate('/login', { replace: true })
                            }}
                        >
                            Log out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    ) : (
        <></>
    )
}

export default Chat
