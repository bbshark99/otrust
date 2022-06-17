export const shorter = str => (str?.length > 8 ? `${str.slice(0, 6)}...${str.slice(-4)}` : str);

// export const fetcher = (library: Web3Provider, abi?: any) => (...args) => {
//   const [arg1, arg2, ...params] = args
//   // it's a contract
//   if (isAddress(arg1)) {
//     const address = arg1
//     const method = arg2
//     const contract = new Contract(address, abi, library.getSigner())
//     return contract[method](...params)
//   }
//   // it's a eth call
//   const method = arg1
//   return library[method](arg2, ...params)
// }
