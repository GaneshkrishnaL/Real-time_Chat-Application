import React, { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedView: FC<PropsWithChildren> = (props) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('@token'))
            return navigate('/login', { replace: true })
    }, [])

    return <>{props.children}</>
}

export default ProtectedView
