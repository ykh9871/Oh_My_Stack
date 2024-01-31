import React from 'react';
import './components/svgc/SvgC.css'

const SvgComponent = () => (
    <svg className='svgStyle' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <path fill="currentColor" d="M9 12.5c.786 0 1.512-.26 2.096-.697l2.55 2.55a.5.5 0 1 0 .708-.707l-2.55-2.55A3.5 3.5 0 1 0 9 12.5Zm0-1a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5ZM6 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6ZM4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"/>
    </svg>

);

export default SvgComponent;