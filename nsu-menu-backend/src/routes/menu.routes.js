import { Router } from 'express'
import {
  listMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menu.controller.js'

export const menuRouter = Router()

menuRouter.get('/', listMenuItems)
menuRouter.post('/', createMenuItem)
menuRouter.put('/:id', updateMenuItem)
menuRouter.delete('/:id', deleteMenuItem)
