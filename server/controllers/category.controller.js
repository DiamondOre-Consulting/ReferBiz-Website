import categorySchema from "../models/category.schema.js";
import CustomError from "../utils/error.utils.js";

const getAllCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, searchQuery = "" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const startIndex = (pageNum - 1) * limitNum;

    const list = await categorySchema
      .find({
        categoryName: { $regex: searchQuery, $options: "i" },
      })
      .skip(startIndex)
      .limit(limitNum);

    const totalCount = await categorySchema.countDocuments({
      categoryName: { $regex: searchQuery, $options: "i" },
    });

    res.status(200).json({
      status: true,
      message: "Category list",
      list,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const addCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return next(new CustomError("Category is required!", 400));
    }

    const category = await categorySchema.create({
      categoryName: categoryName,
      subCategory: [],
    });

    if (!category) {
      return next(new CustomError("Try again!", 400));
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category added successfully!",
      list: await categorySchema.find({}),
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new CustomError("Category is required!", 400));
    }

    const category = await categorySchema.findByIdAndDelete(id);

    if (!category) {
      return next(new CustomError("Try again!", 400));
    }

    const list = await categorySchema.find({});

    res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
      list,
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryName, subCategory } = req.body;

    if (!id) {
      return next(new CustomError("Category is required!", 400));
    }

    const category = await categorySchema.findById(id);

    if (!category) {
      return next(new CustomError("Category is not available!", 400));
    }

    if (categoryName) {
      category.categoryName = await categoryName;
    }

    if (subCategory) {
      category.subCategory.push(subCategory);
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
      list: await categorySchema.find({}),
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new CustomError("Category is required!", 400));
    }

    const category = await categorySchema.findById(id);

    if (!category) {
      return next(new CustomError("Category is not available!", 400));
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category detail!",
      category,
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subCategory } = req.body;

    if (!id) {
      return next(new CustomError("Category ID is required!", 400));
    }

    if (!subCategory) {
      return next(new CustomError("SubCategory is required!", 400));
    }

    const category = await categorySchema.findById(id);

    if (!category) {
      return next(new CustomError("Category not found!", 404));
    }

    const filteredSubCategories = category.subCategory.filter(
      (item) => item.toLowerCase() !== subCategory.toLowerCase()
    );

    if (filteredSubCategories.length === category.subCategory.length) {
      return next(
        new CustomError("SubCategory not found in the category!", 404)
      );
    }

    category.subCategory = filteredSubCategories;
    await category.save();

    res.status(200).json({
      success: true,
      message: "SubCategory deleted successfully!",
      category,
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

export {
  getAllCategory,
  addCategory,
  deleteCategory,
  updateCategory,
  getCategory,
  deleteSubCategory,
};
