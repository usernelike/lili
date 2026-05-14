import { Router } from 'express'
import enterpriseRoutes from './enterprise'
import financialRoutes from './financial'
import interviewRoutes from './interview'
import watchlistRoutes from './watchlist'
import positionsRoutes from './positions'

const router: ReturnType<typeof Router> = Router()

router.use('/enterprise', enterpriseRoutes)
router.use('/financial', financialRoutes)
router.use('/interview', interviewRoutes)
router.use('/watchlist', watchlistRoutes)
router.use('/positions', positionsRoutes)

export default router
