// src/app/browse/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Star, Users, Bath, Bed, Search } from "lucide-react";
import { useProperty } from "@/services/property/useProperty";
import { useAuth } from "@/context/authContext";

export default function BrowsePage() {
  const { user, logout } = useAuth();
  const {
    properties,
    loading,
    error,
    getAvailableProperties,
    searchByCity,
    searchByRentRange,
  } = useProperty();

  const [filters, setFilters] = useState({
    priceRange: 50000,
    selectedBeds: null as number | null,
    selectedBaths: null as number | null,
    searchCity: "",
    minRent: 0,
    maxRent: 50000,
  });

  const [filteredProperties, setFilteredProperties] = useState(properties);

  // Fetch available properties on component mount
  useEffect(() => {
    getAvailableProperties();
  }, []);

  // Apply filters whenever filters or properties change
  useEffect(() => {
    let filtered = properties;

    // Filter by bedrooms
    if (filters.selectedBeds !== null) {
      filtered = filtered.filter(
        (property) => property.bedrooms === filters.selectedBeds
      );
    }

    // Filter by bathrooms
    if (filters.selectedBaths !== null) {
      filtered = filtered.filter(
        (property) => property.bathrooms === filters.selectedBaths
      );
    }

    // Filter by rent range
    filtered = filtered.filter(
      (property) =>
        property.rent >= filters.minRent && property.rent <= filters.maxRent
    );

    // Filter by city search
    if (filters.searchCity.trim()) {
      filtered = filtered.filter((property) =>
        property.city.toLowerCase().includes(filters.searchCity.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  }, [properties, filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchByCity = async () => {
    if (filters.searchCity.trim()) {
      try {
        await searchByCity(filters.searchCity);
      } catch (error) {
        console.error("Failed to search by city:", error);
      }
    } else {
      // If search is cleared, reload all available properties
      getAvailableProperties();
    }
  };

  const handleRentRangeSearch = async () => {
    try {
      await searchByRentRange(filters.minRent, filters.maxRent);
    } catch (error) {
      console.error("Failed to search by rent range:", error);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: 50000,
      selectedBeds: null,
      selectedBaths: null,
      searchCity: "",
      minRent: 0,
      maxRent: 50000,
    });
    getAvailableProperties();
  };

  const handleLogout = () => {
    logout();
  };

  // Calculate price range for the slider
  const maxRentInProperties = Math.max(...properties.map((p) => p.rent), 50000);
  const minRentInProperties = Math.min(...properties.map((p) => p.rent), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            HomeStay
          </Link>
          <div className="flex items-center gap-4">
            {user?.role === "OWNER" && (
              <Link href="/owner/dashboard">
                <Button variant="ghost">Owner Dashboard</Button>
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link href="/admin/dashboard">
                <Button variant="ghost">Admin</Button>
              </Link>
            )}
            {user ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
              </div>

              <div className="space-y-6">
                {/* City Search */}
                <div>
                  <Label className="mb-3 block">Search by City</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter city name..."
                      value={filters.searchCity}
                      onChange={(e) =>
                        handleFilterChange("searchCity", e.target.value)
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSearchByCity()
                      }
                    />
                    <Button
                      size="icon"
                      onClick={handleSearchByCity}
                      disabled={loading}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Rent Range */}
                <div>
                  <Label className="mb-3 block">Monthly Rent Range</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minRent}
                        onChange={(e) =>
                          handleFilterChange("minRent", Number(e.target.value))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxRent}
                        onChange={(e) =>
                          handleFilterChange("maxRent", Number(e.target.value))
                        }
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleRentRangeSearch}
                      disabled={loading}
                    >
                      Apply Rent Filter
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    ₹{filters.minRent.toLocaleString()} - ₹
                    {filters.maxRent.toLocaleString()}
                  </p>
                </div>

                {/* Bedrooms */}
                <div>
                  <Label className="mb-3 block">Bedrooms</Label>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((beds) => (
                      <button
                        key={beds}
                        onClick={() =>
                          handleFilterChange(
                            "selectedBeds",
                            filters.selectedBeds === beds ? null : beds
                          )
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          filters.selectedBeds === beds
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {beds} Bedroom{beds > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <Label className="mb-3 block">Bathrooms</Label>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((baths) => (
                      <button
                        key={baths}
                        onClick={() =>
                          handleFilterChange(
                            "selectedBaths",
                            filters.selectedBaths === baths ? null : baths
                          )
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          filters.selectedBaths === baths
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {baths} Bathroom{baths > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Available Propertie s</h2>
              <p className="text-muted-foreground">
                {loading
                  ? "Loading..."
                  : `${filteredProperties.length} properties found`}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive">Error: {error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Properties Grid */}
            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No Properties Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria.
                </p>
                <Button onClick={handleResetFilters}>Reset Filters</Button>
              </div>
            )}

            {!loading && filteredProperties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <Link key={property.id} href={`/property/${property.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="relative">
                        <img
                          src={property.imageUrl || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <button
                          className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: Implement favorite functionality
                            console.log("Add to favorites:", property.id);
                          }}
                        >
                          <Heart className="w-5 h-5 text-accent" />
                        </button>
                        {!property.isAvailable && (
                          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium">
                            Not Available
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4" />
                          {property.address}, {property.city}, {property.state}
                        </div>

                        <div className="flex items-center gap-4 text-sm mb-3 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {property.bedrooms} bed
                            {property.bedrooms > 1 ? "s" : ""}
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            {property.bathrooms} bath
                            {property.bathrooms > 1 ? "s" : ""}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {property.squareFeet} sq ft
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-primary">
                              ₹{property.rent.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              /month
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            disabled={!property.isAvailable}
                          >
                            {property.isAvailable
                              ? "View Details"
                              : "Not Available"}
                          </Button>
                        </div>

                        {/* Property Type Badge */}
                        <div className="mt-3">
                          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                            {property.propertyType}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
