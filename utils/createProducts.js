import { productSchema } from "../models/models.js"

export const createProducts = () => {
  productSchema.deleteMany({},() => {})
  productSchema.countDocuments({}).exec((err,count) => {
    if(count === 0){
      productSchema.create([
        {
          id:"price_1McDIDFbuSFlLnppYnVeZAr3",
          name:"Starter",
          amount:"15",
          type:"monthly",
          description:"Create a new subscription",
        },
        {
          id:"price_1McDJ2FbuSFlLnppcsWd4dN0",
          name:"Advanced",
          amount:"30",
          type:"monthly",
          description:"Advanced subscription package",
        },
        {
          id:"price_1McDJYFbuSFlLnpp7nNQQQDO",
          name:"Premium",
          amount:"50",
          type:"monthly",
          description:"Premium subscription package",
        }
      ]);
    }else if(count > 4){
      productSchema.deleteMany({},() => {});
      createProducts();
    }
  })
  
  
}
