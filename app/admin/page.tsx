import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminStats } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CreditCard, LayoutDashboard, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Kontrollera att användaren är inloggad och är ADMIN
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getAdminStats();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/admin/articles/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Skapa Artikel
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Användare</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Totalt antal registrerade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Prenumerationer</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Betalande medlemmar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artiklar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              Publicerade och utkast
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beräknad Intäkt</CardTitle>
            <div className="text-xs font-bold text-green-600">SEK</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeSubscriptions * 99} kr
            </div>
            <p className="text-xs text-muted-foreground">
              Baserat på 99 kr/mån
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Snabblänkar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-40 h-24 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                Hantera Användare
              </Button>
            </Link>
            <Link href="/admin/articles">
              <Button variant="outline" className="w-40 h-24 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                Hantera Artiklar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}