import { FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.scss'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import TextField from '../components/TextField'
import axios from 'axios'
import { API_URL } from '../utils/constants'

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().min(8).max(20).required(),
})

const Login: FC = () => {
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await axios.post(`${API_URL}auth/login`, values)
                if (res.status === 201) {
                    const token = res.data?.token
                    localStorage.setItem('@token', token)
                    resetForm()
                    return navigate('/')
                }
            } catch (error) {
                return console.log(error)
            }
        },
    })

    useEffect(() => {
        if (localStorage.getItem('@token')) {
            navigate('/', { replace: true })
            return
        }
    }, [])

    return (
        <div className="h-screen w-full grid place-items-center">
            <form className="login-form" onSubmit={formik.handleSubmit}>
                <h1 className="font-bold text-2xl mb-3.5">Login</h1>
                <TextField
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.email && formik.errors.email
                            ? formik.errors.email
                            : ''
                    }
                />

                <TextField
                    label="Password"
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.password && formik.errors.password
                            ? formik.errors.password
                            : ''
                    }
                />

                <input type="submit" value="Login" />

                <section className="flex items-baseline gap-x-2 mt-5">
                    <span>Not registered?</span>
                    <Link to="/register" className="text-blue-500 underline">
                        Create new account
                    </Link>
                </section>
            </form>
        </div>
    )
}

export default Login
