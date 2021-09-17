export function getFirstMessage(messagesObject) {
  const filteredArray = Object.values(messagesObject).filter(message => message);
  return filteredArray.length ? filteredArray[0] : null;
}
