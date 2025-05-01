'use client'

import {
  ArrowUpRight,
  ChevronDown,
  Clock,
  Cog,
  Expand,
  Filter,
  GripVertical,
  ListFilter,
  MoreHorizontal,
  Plus,
  RefreshCw,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Overview() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-1 gap-4">
        {/* Card 1 */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Card 1</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Expand className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This is the first card.</p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Card 2</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Expand className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This is the second card.</p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Card 3</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Expand className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This is the second card.ss</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
