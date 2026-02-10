import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { getUserProfile, getTransferRequest } from "@/actions/request";
import { findMatches } from "@/lib/matching";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, User, CheckCircle2 } from "lucide-react";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  // 1. GUEST VIEW
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black text-center px-4">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Αμοιβαίες Μεταθέσεις
            <span className="block text-blue-600 mt-2">Δημόσιου Τομέα</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Η πλατφόρμα που συνδέει δημοσίους υπαλλήλους για αμοιβαία μετάθεση.
            Βρείτε τον συνάδελφο που θέλει να έρθει στη θέση σας.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                Εγγραφή
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto">
                Σύνδεση
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED IN VIEW - DASHBOARD
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="container mx-auto py-20 text-center space-y-6">
        <h2 className="text-3xl font-bold">Καλωσήρθατε, {user.name || "Χρήστη"}!</h2>
        <p className="text-lg text-muted-foreground">Για να ξεκινήσετε τη διαδικασία matching, πρέπει πρώτα να δημιουργήσετε το επαγγελματικό σας προφίλ.</p>
        <Link href="/profile">
          <Button>Δημιουργία Προφίλ</Button>
        </Link>
      </div>
    )
  }

  const request = await getTransferRequest();

  if (!request) {
    return (
      <div className="container mx-auto py-20 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Το Προφίλ μου: {profile.specialty.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{profile.currentZone.name}</span>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-8 text-center space-y-4">
            <h3 className="text-xl font-semibold text-blue-900">Δεν έχετε ενεργή αίτηση μετάθεσης.</h3>
            <p className="text-blue-700">Δηλώστε τις περιοχές που επιθυμείτε να μετατεθείτε για να βρούμε το ταίρι σας.</p>
            <Link href="/request/create">
              <Button size="lg" className="mt-4">Υποβολή Αίτησης</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 3. MATCHING RESULTS
  const currentRequest = request; // Assuming currentRequest refers to the 'request' variable
  const matches = currentRequest && profile ? await findMatches(profile.id) : []

  const activeMatches = matches.filter(m => m.status === 'active')
  const inactiveMatches = matches.filter(m => m.status !== 'active');

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Καλωσήρθατε, {user.name}</h2>
          <p className="text-muted-foreground mt-1">
            Ειδικότητα: <span className="font-medium text-foreground">{profile.specialty.name}</span> •
            Τρέχουσα Θέση: <span className="font-medium text-foreground">{profile.currentZone.name}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/request/create">
            <Button variant="outline">Διαχείριση Αίτησης</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {/* Active Matches Section */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Ενεργά Ταιριάσματα ({activeMatches.length})
          </h3>

          {activeMatches.length === 0 ? (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>Δεν υπάρχουν ενεργά ταιριάσματα αυτή τη στιγμή.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMatches.map((match) => (
                <Card key={match.id} className="overflow-hidden border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-slate-50 pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {match.user.fullName}
                        </CardTitle>
                        <CardDescription>
                          {match.user.email}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Υπηρετει:</div>
                      <div className="flex items-center gap-2 font-medium">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {match.user.currentZone.name}
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-auto">
                          (Επιθυμητή)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Επιθυμει:</div>
                      <div className="flex flex-wrap gap-2">
                        {match.targetZones.map(tz => (
                          <Badge
                            key={tz.id}
                            variant={tz.id === profile.currentZone.id ? "default" : "secondary"}
                            className={tz.id === profile.currentZone.id ? "bg-blue-600 hover:bg-blue-700" : ""}
                          >
                            {tz.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Inactive Matches (History) Section - Only show if there are entries */}
        {inactiveMatches.length > 0 && (
          <div className="pt-8 border-t">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-muted-foreground">
              <span className="text-2xl">📜</span>
              Ιστορικό Ταιριασμάτων ({inactiveMatches.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {inactiveMatches.map((match) => (
                <Card key={match.id} className="bg-slate-50 border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          {match.user.fullName}
                        </CardTitle>
                        <CardDescription>{match.user.email}</CardDescription>
                      </div>
                      <Badge variant="secondary">Ανενεργό</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Υπηρετούσε:</div>
                      <div className="flex items-center gap-2 font-medium text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {match.user.currentZone.name}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right mt-2">
                      Ημ/νία: {match.matchDate.toLocaleDateString('el-GR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
