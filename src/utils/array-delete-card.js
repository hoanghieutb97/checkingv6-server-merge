function cal_ArrayDeleteCardId(cardId, array) {
  
    var items = array.map(item => {
        if (item.cardId == cardId) return null
        return item
    })
    
    return items.filter(item => item !== null)

}
module.exports = cal_ArrayDeleteCardId;