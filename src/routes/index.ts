import { Router } from "express";
import { getRepository } from "typeorm";
import { Shows } from "../entity/Show";
import {
  addDays,
  search,
  randomVenue,
  setToken,
  timeDiffMins,
  getLastArtist,
  randomArtist
} from "../utils";
import { Artists } from "../entity/Artist";
import { ws } from "..";

let sale = "running";
let picked = false;
let searchResults = {
  artists: {
    items: [{ id: "teemo", name: "teemo", images: [] }]
  }
};
const routes = Router();

routes.get("/initShows", async (req, res) => {
  if (req.session.creator) {
    return res.send({ status: "creator" });
  }
  try {
    const showRepo = getRepository(Shows);
    const lastShow = await showRepo.findOne({ order: { id: "DESC" } });
    const diff = timeDiffMins(lastShow.created_at);
    if (diff > 60) {
      sale = undefined;
      picked = false;
    }
  } catch (e) {
    console.log(e);
  }
  switch (sale) {
    case undefined:
      setTimeout(async () => {
        if (sale === "running") return;
        const rArtist = picked ? await getLastArtist() : await randomArtist();
        const showRepo = getRepository(Shows);
        const newShow = new Shows();
        newShow.artists = rArtist;
        const event = new Date();
        event.setHours(16);
        event.setMinutes(20);
        const tomorrow = addDays(event, 1);
        newShow.date = tomorrow;
        newShow.price = `${Math.floor(Math.random() * 100)}.00`;
        newShow.venue = randomVenue();
        await showRepo.save(newShow);

        sale = "running";
        req.session.destroy(() => {});
        ws.local.emit("start", {
          onsale: [{ ...newShow, artist: rArtist.name, img: rArtist.img }],
          status: "running"
        });
      }, 5 * 60 * 1000);
      sale = "waiting";
      req.session.creator = true;
      return res.send({ status: "creator" });
    case "waiting":
      return res.send({ status: "waiter" });
    case "running":
      const showsRepo = getRepository(Shows);
      const onsale = await showsRepo.findOne({
        order: { id: "DESC" },
        relations: ["artists"]
      });
      return res.send({
        onsale: [
          { ...onsale, artist: onsale.artists.name, img: onsale.artists.img }
        ],
        status: "running"
      });
  }
});
routes.post("/search", async (req, res) => {
  const results = await search(req.body.artist);
  searchResults = results;
  res.send(results);
});

routes.get("/reset", async (req, res) => {
  sale = undefined;
});
routes.get("/new_token", async (req, res) => {
  await setToken();
  return res.send({ message: "new_token" });
});

routes.post("/pick", async (req, res) => {
  const { selected } = req.body;
  const artist = searchResults.artists.items.find(s => s.id === selected);
  if (!artist) return res.status(401).send({ message: "search_again" });
  const artistRepo = getRepository(Artists);
  const newArtist = new Artists();
  newArtist.id = artist.id;
  newArtist.name = artist.name;
  newArtist.img = artist.images[0] ? artist.images[0].url : null;
  await artistRepo.save(newArtist);
  // newArtist.venue = randomVenue();
  const showRepo = getRepository(Shows);
  const newShow = new Shows();
  newShow.artists = newArtist;
  const event = new Date();
  event.setHours(16);
  event.setMinutes(20);
  const tomorrow = addDays(event, 1);
  newShow.date = tomorrow;
  newShow.price = `${Math.floor(Math.random() * 100)}.00`;
  newShow.venue = randomVenue();
  await showRepo.save(newShow);
  picked = true;
  sale = "waiting";
  req.session.destroy(() => {});
  ws.local.emit("start", {
    onsale: [{ ...newShow, artist: newArtist.name, img: newArtist.img }],
    status: "waiter"
  });
});

export default routes;
