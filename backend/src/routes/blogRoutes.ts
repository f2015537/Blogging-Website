import { Router } from "express";

const router = Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  return res.send("get blog route");
});

router.post("/", (req, res) => {
  return res.send("blog creation route");
});

router.put("/", (req, res) => {
  return res.send("blog update route");
});

export default router;
