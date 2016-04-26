/* global angular mario */

mario.service('algorithmCost', [ function () {
  this.initialSave = function (model, response) {
    angular.extend(model, response.data)
    model.selected.algorithm = response.data.algorithms[1]
    model.selected.costs = [response.data.algorithmCosts[0]]
  }
  this.selectAlgo = function (model, algorithm) {
    model.selected.costs = [model.selected.costs[0]]
  }
  this.selectCost = function (model, cost) {
    if (model.selected.algorithm.indexOf('skyline') >= 0) {
      if (model.selected.costs.length <= 1 && model.selected.costs[0] === cost) {
        return
      } else if (model.selected.costs.indexOf(cost) === -1) {
        model.selected.costs.push(cost)
      } else {
        model.selected.costs.splice(model.selected.costs.indexOf(cost), 1)
      }
    } else {
      model.selected.costs.pop()
      model.selected.costs.push(cost)
    }
  }
}])
