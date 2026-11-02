import React from 'react'

const ExchangeSportsbookHeader = () => {
    return (
        <div>
            <ul className="bg-gradient-to-b from-[#5f7fdb] to-[#0cddff] flex justify-center items-center py-[3px]">
                <li><button className="block bg-primary-theme border border-primary-theme text-sm text-white uppercase font-bold px-4 py-2 rounded-[10px] mx-[2px] shadow-[inset_0_0_0_1px_theme(colors.primary.theme)]">Exchange</button></li>
                <li><button className="block text-sm uppercase font-bold px-4 py-2 border border-primary-theme rounded-[10px] mx-[2px] shadow-[inset_0_0_0_1px_theme(colors.primary.theme)]">Sportsbook</button></li>
            </ul>
        </div>
    )
}

export default ExchangeSportsbookHeader