import wordmark from '../../assets/brand/logo/lockup-idrl.svg'
import reverseWordmark from '../../assets/brand/logo/lockup-idrl-reverse.svg'
import reverse from '../../assets/brand/logo/symbol-color-reverse.svg'
import symbol from '../../assets/brand/logo/symbol-color.svg'
export function Brand({dark,compact=false}:{dark?:boolean;compact?:boolean}) {
 const lightSrc=compact?symbol:wordmark
 const darkSrc=compact?reverse:reverseWordmark
 const className=compact?'brand-symbol':'brand-wordmark'
 const alt=compact?'IDRL':'IDRL · Intelligent Design and Robust Learning'
 if(dark!==undefined)return <img className={className} src={dark?darkSrc:lightSrc} alt={alt}/>
 return <><img className={`${className} brand-theme-light`} src={lightSrc} alt={alt}/><img className={`${className} brand-theme-dark`} src={darkSrc} alt={alt}/></>
}
