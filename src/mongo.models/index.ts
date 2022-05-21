import userModel from "./user.model";

export const mongoModels = {
    User: userModel,
};

const models = Object.keys(mongoModels);
/**
 * create mongo models
 * */
export default () => models.forEach(key => {
    const model = new mongoModels[key];
    model.save();
})
