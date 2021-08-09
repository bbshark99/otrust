export function getFirstMessage(messagesObject) {
  let filteredArray = Object.values(messagesObject).filter(message => message);
  return filteredArray.length ? filteredArray[0] : null;
}
