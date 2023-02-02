const Criterion = require("../models/Criterion");
const Gate = require("../models/Gate");
const Item = require("../models/Item");

// virtuals work good enough for this
const updateCriteria = async (criteria, isMultiple = true) => {
  criteria = await Promise.all(
    criteria.map(async c => {
      c.items = await Item.find({ criterion: c._id });
      return c;
    })
  );
  return isMultiple ? criteria : criteria[0];
};

const updateGates = async (gates, isMultiple = true) => {
  // for (let index = 0; index < gates.length; index++) {
  //   const element = gates[index];
    
  // } 
  gates = await Promise.all(gates.map(async (g) => {
    g.criteria = await Criterion.find({gate: g._id}).populate("items")
    return g
  }))
  return isMultiple ? gates : gates[0]
}

const updateTypes = async (types, isMultiple = true) => {
  // for (let index = 0; index < types.length; index++) {
  //   const element = types[index];

  // }
  types = await Promise.all(
    types.map(async t => {
      const relatedGates = await Gate.find({ type: t._id });
      t.gates = await updateGates(relatedGates)
      return t;
    })
  );
  return isMultiple ? types : types[0];
};

module.exports = {
  updateCriteria,
  updateGates,
  updateTypes,
}