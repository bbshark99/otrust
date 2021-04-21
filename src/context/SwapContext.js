import React, { useEffect, useState, createContext, useContext } from 'react'
import { parseEther, formatEther } from "@ethersproject/units";

// import { ETHtoNOM, NOMtoETH } from 'utils/bonding'
import { useChain } from 'context/chain/ChainContext'
import BigNumber from 'bignumber.js';

export const SwapContext = createContext()
export const useSwap = () => useContext(SwapContext)

export const UpdateSwapContext = createContext()
export const useUpdateSwap = () => useContext(UpdateSwapContext)

function SwapProvider({ children }) {
    const { bondContract } = useChain()
    const [swapBuyAmount, setSwapBuyAmount] = useState('')
    const [swapBuyResult, setSwapBuyResult] = useState('')
    const [swapDenom, setSwapDenom] = useState('ETH')
    const [swapSellAmount, setSwapSellAmount] = useState(0)
    const [swapSellResult, setSwapSellResult] = useState('')
    const [swapSupply, setSwapSupply] = useState([])


    const contextValue = {
        swapBuyAmount,
        swapBuyResult,
        swapDenom,
        swapSellAmount,
        swapSupply,
        swapSellResult
    }

    const updateValue = {
        setSwapBuyAmount,
        setSwapDenom,
        setSwapSellAmount,
        setSwapSupply
    }

    useEffect(() => {
        async function swapAmount() {
            if (swapBuyAmount) {
                if(swapBuyAmount) {
                    const amount = await bondContract.buyQuoteETH(parseEther(swapBuyAmount));
                    setSwapBuyResult(new BigNumber(formatEther(amount)).toFixed(3));
                }
            }
            if(swapSellAmount) {
                if(swapSellAmount) {
                    const amount = await bondContract.sellQuoteNOM(parseEther(swapSellAmount));
                    setSwapSellResult(new BigNumber(formatEther(amount)).toFixed(3));
                }
            }
        }
        swapAmount()
    }, [swapBuyAmount, swapSellAmount, bondContract])

    // useEffect(() => {
    //     if(swapSellAmount === 0) {
    //         setSwapSellResult(0)
    //     } else {
    //         if (swapDenom === 'ETH') {
    //             buyQuoteNOM();
    //         }
    //     }
    // }, [swapSellAmount])

    return (
        <UpdateSwapContext.Provider value={updateValue}>
            <SwapContext.Provider value={contextValue} >
                {children}
            </SwapContext.Provider>
        </UpdateSwapContext.Provider>
    )
}

export default SwapProvider