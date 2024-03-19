const Table = require("../models/tableModel.js");

const shopTable = async function (request, response) {
  try {
    const { shop } = request.query;
 
    const table = await Table.find({shop});
    if (table.length === 0) {
      return response.status(404).json({
        status: "failed",
        message: "No table found",
      });
    }
    return response.status(200).json({
      status: "success",
      message: "All tables",
      data: { table },
    });
  } catch (e) {
    return response.status(400).send({ message: e.message });
  }
};

const getTables = async function (request, response) {
  try {
    const table = await Table.find().populate("shop");
    if (table.length === 0) {
      return response.status(404).json({
        status: "failed",
        message: "No table found",
      });
    }
    return response.status(200).json({
      status: "success",
      message: "All tables",
      data: { table },
    });
  } catch (e) {
    return response.status(400).send({ message: e.message });
  }
};

const detailTable = async function (request, response) {
  try {
    const { id } = request.params;
    const table = await Table.findById(id).populate("shop");
    if (table.length === 0) {
      return response.status(404).json({
        status: "failed",
        message: "No table found",
      });
    }
    return response.status(200).json({
      status: "success",
      message: "All tables",
      data: { table },
    });
  } catch (e) {
    return response.status(400).send({ message: e.message });
  }
};

const createTable = async function (request, response) {
  try {
    const { number, capacity, status, shop } = request.body;

    if (!number || !capacity || !shop) {
      return response.status(400).json({
        status: "failed",
        message: "Fill all the fields",
      });
    }

    const table = await Table.create({
      number,
      capacity,
      status,
      shop,
    });

    return response.status(201).json({
      status: "success",
      message: "Table created successfully",
    });
  } catch (e) {
    return response.status(400).send({
      message: e.message,
    });
  }
};

const updateTable = async function (request, response) {
  try {
    const { number, capacity, shop } = request.body;
    const { id } = request.params;
    const table = await Table.findById(id);

    if (!number || !capacity || !shop) {
      return response.status(400).json({
        status: "failed",
        message: "Fill all required the fields",
      });
    }
    if (!table) {
      return response.status(404).json({
        status: "failed",
        message: "Table not found",
      });
    }

    const updateTable = await Table.findByIdAndUpdate(id, request.body, { new: true });

    return response.status(200).json({
      status: "success",
      message: "Table Updated",
      data: { table: updateTable },
    });
  } catch (e) {
    console.log(e.message);
    return response.status(400).json({
      message: e.message,
    });
  }
};

const deleteTable = async function (request, response) {
  try {
    const { id } = request.params;
    const table = await Table.findById(id);

    if (!table) {
      return response.status(404).json({
        status: "failed",
        message: "Table Not Found",
      });
    }
    await Table.findByIdAndDelete(id);
    const allTable = await Table.find({});
    return response.status(200).json({
      status: "success",
      message: "Table Deleted",
      data: { table: allTable },
    });
  } catch (e) {
    return response.status(400).json({
      message: e.message,
    });
  }
};

module.exports = { getTables,shopTable, createTable, updateTable, deleteTable, detailTable };
