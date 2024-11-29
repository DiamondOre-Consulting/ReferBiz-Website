import React, { useState, useEffect, useCallback } from "react";

import BreadCrumbs from "../Components/BreadCrumbs";

import Header from "../Components/Header";

const AboutUs = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About Us " },
  ];

  return (
    <>
      <Header />
      <BreadCrumbs headText={"Our Vendors"} items={breadcrumbItems} />
      <section class="py-12">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-8">Who We Are</h2>
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-2xl font-semibold mb-4">About Us</h3>
              <p class="mb-4">
                Welcome to ReferBiz, where innovation meets opportunity. We are
                redefining how businesses grow and how users benefit, creating a
                win-win ecosystem for vendors and customers alike.
              </p>
              <p class="mb-4">
                Whether you’re a vendor looking to boost sales or a user eager
                to save and earn, ReferBiz is your trusted partner in growth and
                success.
              </p>
              <a
                href="#learn-more"
                class="text-blue-600 font-bold hover:underline"
              >
                Learn More →
              </a>
            </div>
            <img
              src="https://source.unsplash.com/600x400/?team,collaboration"
              alt="Who We Are"
              class="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <section class="bg-gray-100 py-12">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-xl font-semibold mb-2">For Users</h3>
              <p class="mb-4">
                Unlock discounts and earn cash rewards by sharing your referral
                code. When your referral makes a purchase, both of you
                benefit—discounts for them and rewards for you.
              </p>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">For Vendors</h3>
              <p class="mb-4">
                Boost your sales and attract new customers through our
                affiliate-driven platform. Gain visibility while customers enjoy
                savings and share their positive experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-12">
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-3xl font-bold mb-6">Why Choose ReferBiz?</h2>
          <p class="max-w-2xl mx-auto mb-8">
            At ReferBiz, we create opportunities for growth, savings, and
            rewards. Join a thriving community where users and businesses
            connect, collaborate, and thrive.
          </p>
          <a
            href="/signup"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
          >
            Get Started Now
          </a>
        </div>
      </section>

      <footer class="bg-blue-600 text-white py-6">
        <div class="container mx-auto px-6 text-center">
          <p>&copy; 2024 ReferBiz. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default AboutUs;
