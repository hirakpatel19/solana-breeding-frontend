import React from 'react'

const Sidebar = () => {
    return (
        <div className=' absolute hidden xl:flex left-0 min-h-screen  xl:w-16  flex-col gap-5 items-center justify-center'>
            <a target="__blank" href="">
                <img src="/images/facebook.png" alt="" />
            </a>
            <a target="__blank" href="">
                <img src="/images/youtube.png" alt="" />
            </a>
            <a target="__blank" href="">
                <img src="/images/twitter.png" alt="" />
            </a>
            <a target="__blank" href="">
                <img src="/images/linkedin.png" alt="" />
            </a>
        </div>
    )
}

export default Sidebar