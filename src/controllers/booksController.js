const { catchError, notFoundErr } = require("../utils/errorHandler");

const booksController = {
  /* ================= GET ALL BOOKS ================= */
  getBooks: async (req, res) => {
    try {
      const books = await req.booksModel.findAll();

      res.status(200).send({
        status: true,
        message: "Books fetched successfully",
        data: books,
        total: books.length,
      });
    } catch (err) {
      catchError(res, err, "Failed to fetch books");
    }
  },

  /* ================= CREATE BOOK ================= */
  createBook: async (req, res) => {
    try {
      const { bookName, description, price } = req.body;

      if (!bookName || !description || !price) {
        return res.status(400).send({
          status: false,
          message: "Required fields missing",
        });
      }

      const image = req.file
        ? req.file.filename
        : null;

      const book = await req.booksModel.create({
        bookName,
        description,
        price,
        image,
      });

      res.status(201).send({
        status: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (err) {
      catchError(res, err, "Failed to create book");
    }
  },

  /* ================= GET BY ID ================= */
  getBookById: async (req, res) => {
    try {
      const book = await req.booksModel.findByPk(
        req.params.id
      );

      if (!book) {
        return notFoundErr(res, "Book not found");
      }

      res.status(200).send({
        status: true,
        data: book,
      });
    } catch (err) {
      catchError(res, err, "Failed to fetch book");
    }
  },

  /* ================= UPDATE ================= */
  updateBook: async (req, res) => {
    try {
      const book = await req.booksModel.findByPk(
        req.params.id
      );

      if (!book) {
        return notFoundErr(res, "Book not found");
      }

      const { bookName, description, price } =
        req.body;

      const image = req.file
        ? req.file.filename
        : book.image;

      const updatedBook = await book.update({
        bookName: bookName ?? book.bookName,
        description:
          description ?? book.description,
        price: price ?? book.price,
        image,
      });

      res.status(200).send({
        status: true,
        message: "Updated successfully",
        data: updatedBook,
      });
    } catch (err) {
      catchError(res, err, "Failed to update");
    }
  },

  /* ================= DELETE ================= */
  deleteBook: async (req, res) => {
    try {
      const book = await req.booksModel.findByPk(
        req.params.id
      );

      if (!book) {
        return notFoundErr(res, "Book not found");
      }

      const deletedData = {
        ...book.dataValues,
      };

      await book.destroy();

      res.status(200).send({
        status: true,
        message: "Deleted successfully",
        data: deletedData,
      });
    } catch (err) {
      catchError(res, err, "Failed to delete");
    }
  },
};

module.exports = booksController;
